import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { requestOAuthLogin, writeAuthSession } from '../api/auth'
import { useAuthStore } from '../store/authStore'

function KakaoCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const setAuth = useAuthStore((state) => state.setAuth)
  const clearTokens = useAuthStore((state) => state.clearTokens)

  const code = params.get('code')
  const error = params.get('error')
  const errorDescription = params.get('error_description')

  const message = useMemo(() => {
    if (error) {
      return errorDescription
        ? `카카오 인증 오류: ${decodeURIComponent(errorDescription)}`
        : '카카오 인증이 취소되었거나 실패했습니다. 다시 시도해주세요.'
    }

    if (isProcessing) {
      return '로그인 정보를 확인 중입니다. 잠시만 기다려주세요.'
    }

    if (code) {
      return '카카오 인증이 완료되었습니다. 로그인 처리 중입니다.'
    }

    return '인증 정보를 확인하지 못했습니다. 다시 로그인해주세요.'
  }, [code, error, errorDescription, isProcessing])

  useEffect(() => {
    if (!code || error) return

    let isCancelled = false

    const processLogin = async () => {
      setIsProcessing(true)

      try {
        const redirectUri =
          import.meta.env.VITE_KAKAO_REDIRECT_URI ?? `${window.location.origin}/oauth/kakao/callback`

        const response = await requestOAuthLogin('kakao', {
          code,
          redirectUri,
        })

        if (isCancelled) return

        writeAuthSession(response)

        setAuth({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isRegistered: response.user.isRegistered,
        })

        navigate(response.user.isRegistered ? '/' : '/profile/register', { replace: true })
      } catch {
        if (isCancelled) return

        clearTokens()
        navigate('/login', { replace: true })
      } finally {
        if (!isCancelled) {
          setIsProcessing(false)
        }
      }
    }

    processLogin()

    return () => {
      isCancelled = true
    }
  }, [code, error, navigate, setAuth, clearTokens])

  return (
    <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <h2>RE:CALL</h2>
        <p>{message}</p>
        {(error || !code) && (
          <button type="button" onClick={() => navigate('/login', { replace: true })}>
            로그인 페이지로 돌아가기
          </button>
        )}
      </div>
    </div>
  )
}

export default KakaoCallbackPage