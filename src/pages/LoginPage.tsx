import { useState } from 'react'
import style from './styles/LoginPage.module.css'
import kakaoLoginImg from '../assets/images/kakao_login_large_wide.png'
import { MOCK_EXISTING_USER_CODE, MOCK_NEW_USER_CODE } from '../api/auth'

const KAKAO_AUTH_BASE_URL = 'https://kauth.kakao.com/oauth/authorize'

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleKakaoLogin = () => {
    setErrorMessage(null)

    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
    const redirectUri =
      import.meta.env.VITE_KAKAO_REDIRECT_URI ??
      `${window.location.origin}/oauth/kakao/callback`

    if (!clientId) {
      setIsLoading(true)
      window.location.href = `${window.location.origin}/oauth/kakao/callback?code=${encodeURIComponent(MOCK_NEW_USER_CODE)}`
      return
    }

    setIsLoading(true)

    const authUrl =
      `${KAKAO_AUTH_BASE_URL}?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`

    window.location.href = authUrl
  }

  return (
    <div className={style.LoginPage}>
      <div className={style.LoginPageBasic}>
        <div className={style.LoginPageText}>
          <div>안녕하세요</div>
          <div>RE:CALL 입니다.</div>
          <p style={{ fontSize: '16px' }}>찾고 싶은 추억의 친구가 있으신가요?</p>
        </div>

        <div className={style.LoginButton}>
          <div style={{ marginLeft: '10px' }}>LOGIN</div>
          <br />
          <button type="button" onClick={handleKakaoLogin} disabled={isLoading}>
            <img src={kakaoLoginImg} alt="카카오 로그인" />
          </button>

          {!import.meta.env.VITE_KAKAO_REST_API_KEY && (
            <button
              type="button"
              onClick={() => {
                setIsLoading(true)
                window.location.href = `${window.location.origin}/oauth/kakao/callback?code=${encodeURIComponent(MOCK_EXISTING_USER_CODE)}`
              }}
              disabled={isLoading}
            >
              (개발용) 기존회원으로 로그인
            </button>
          )}

          {isLoading && <p>카카오 로그인 페이지로 이동 중...</p>}

          {!import.meta.env.VITE_KAKAO_REST_API_KEY && (
            <p style={{ color: '#475569' }}>
              개발모드: 키가 없어 목업 OAuth 흐름으로 동작합니다.
            </p>
          )}

          {errorMessage && <p style={{ color: '#d4380d' }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}

export default LoginPage