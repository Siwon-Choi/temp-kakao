import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function KakaoCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', padding: 24 }}>
      <p>OAuth 콜백은 비활성화되었습니다. 로그인 페이지로 이동합니다.</p>
    </div>
  )
}

export default KakaoCallbackPage
