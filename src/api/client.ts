import type { RefreshTokenResponse } from '../types/auth'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

type RequestOptions = RequestInit & {
  auth?: boolean
  retryOnUnauthorized?: boolean
}

type ErrorResponse = {
  message?: string
  error?: string
}

const buildHeaders = (headers?: HeadersInit, accessToken?: string | null) => {
  const nextHeaders = new Headers(headers)

  if (!nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    nextHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  return nextHeaders
}

const refreshAccessToken = async () => {
  const { refreshToken, setTokens, clearTokens } = useAuthStore.getState()

  if (!refreshToken) {
    clearTokens()
    throw new Error('refreshToken 이 없습니다.')
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    clearTokens()
    throw new Error('토큰 재발급에 실패했습니다.')
  }

  const data = (await response.json()) as RefreshTokenResponse

  setTokens({
    accessToken: data.accessToken,
    refreshToken,
  })

  return data.accessToken
}

const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as ErrorResponse
    return data.message ?? data.error ?? '요청에 실패했습니다.'
  } catch {
    return '요청에 실패했습니다.'
  }
}

export const apiRequest = async <T>(
  path: string,
  { auth = false, retryOnUnauthorized = true, headers, ...init }: RequestOptions = {},
): Promise<T> => {
  const accessToken = auth ? useAuthStore.getState().accessToken : null
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(headers, accessToken),
  })

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const nextAccessToken = await refreshAccessToken()

    return apiRequest<T>(path, {
      ...init,
      auth: true,
      retryOnUnauthorized: false,
      headers: buildHeaders(headers, nextAccessToken),
    })
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return response.json() as Promise<T>
}
