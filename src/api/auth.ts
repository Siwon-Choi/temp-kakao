// import { apiRequest } from './client'
// import type { OAuthLoginRequest, OAuthLoginResponse, OAuthProvider } from '../types/auth'

// export const requestOAuthLogin = (provider: OAuthProvider, payload: OAuthLoginRequest) =>
//   apiRequest<OAuthLoginResponse>(`/api/auth/oauth/${provider}`, {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   })

export type OAuthProvider = 'kakao'

export type OAuthRequest = {
  code: string
  redirectUri: string
}

export type OAuthUser = {
  oauthId: string
  provider: OAuthProvider
  email: string
  name: string
  isRegistered: boolean
}

export type OAuthResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
  user: OAuthUser
}

export type AuthSession = OAuthResponse

export type AuthMeResponse =
  | {
      authenticated: false
      isRegistered: false
      user: null
    }
  | {
      authenticated: true
      isRegistered: boolean
      user: OAuthUser
    }

const AUTH_SESSION_KEY = 'auth.session'

const KAKAO_EXISTING_USER_CODE = 'kakao-existing-user'
const KAKAO_NEW_USER_CODE = 'kakao-new-user'

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestOAuthLogin(provider: OAuthProvider, request: OAuthRequest): Promise<OAuthResponse> {
  await wait()

  const isRegistered = request.code === KAKAO_EXISTING_USER_CODE
  const timestamp = Date.now().toString(36)

  return {
    accessToken: `mock-access-token-${timestamp}`,
    refreshToken: `mock-refresh-token-${timestamp}`,
    expiresIn: 3600,
    tokenType: 'Bearer',
    user: {
      oauthId: `oauth-${provider}-${timestamp}`,
      provider,
      email: isRegistered ? 'registered@recall.kr' : 'new-user@recall.kr',
      name: isRegistered ? '기존 회원' : '신규 회원',
      isRegistered,
    },
  }
}

export async function requestAuthMe(): Promise<AuthMeResponse> {
  await wait(200)
  const session = readAuthSession()

  if (!session) {
    return {
      authenticated: false,
      isRegistered: false,
      user: null,
    }
  }

  return {
    authenticated: true,
    isRegistered: session.user.isRegistered,
    user: session.user,
  }
}

export function readAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function writeAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY)
}

export function markUserRegistered(session: AuthSession): AuthSession {
  const nextSession = {
    ...session,
    user: {
      ...session.user,
      isRegistered: true,
    },
  }
  writeAuthSession(nextSession)
  return nextSession
}



export type UserSignupRequest = {
  email: string
  name: string
  phone?: string
  address?: string
}

export async function requestUserSignup(payload: UserSignupRequest, accessToken: string): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not set')
  }

  const response = await fetch(`${baseUrl}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `회원가입 API 요청이 실패했습니다. (${response.status})`)
  }
}
export const MOCK_EXISTING_USER_CODE = KAKAO_EXISTING_USER_CODE
export const MOCK_NEW_USER_CODE = KAKAO_NEW_USER_CODE
