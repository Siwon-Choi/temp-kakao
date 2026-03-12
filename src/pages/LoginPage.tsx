import { useState } from 'react'
import style from './styles/LoginPage.module.css'
import { requestSessionLogin, writeAuthSession } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSessionLogin = async (role: 'existing' | 'new') => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await requestSessionLogin({ role })

      writeAuthSession(response)

      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isRegistered: response.user.isRegistered,
      })

      navigate(response.user.isRegistered ? '/' : '/profile/register', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={style.LoginPage}>
      <div className={style.LoginPageBasic}>
        <div className={style.LoginPageText}>
          <div>안녕하세요</div>
          <div>RE:CALL 입니다.</div>
          <p style={{ fontSize: '16px' }}>한 번 로그인하면 세션을 전역으로 유지합니다.</p>
        </div>

        <div className={style.LoginButton}>
          <div style={{ marginLeft: '10px' }}>LOGIN</div>
          <br />

          <button type="button" onClick={() => handleSessionLogin('existing')} disabled={isLoading}>
            기존 회원 로그인
          </button>

          <button type="button" onClick={() => handleSessionLogin('new')} disabled={isLoading}>
            신규 회원 로그인
          </button>

          {isLoading && <p>세션 로그인 처리 중...</p>}

          <p style={{ color: '#475569' }}>OAuth 없이 세션 기반 로그인으로 동작합니다.</p>

          {errorMessage && <p style={{ color: '#d4380d' }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
