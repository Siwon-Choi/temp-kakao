// 가입 완료된 사용자만 메인 서비스로 가게함

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

function RegistrationRoute() {
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isRegistered = useAuthStore((state) => state.isRegistered)

  if (!isInitialized) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isRegistered) {
    return <Navigate to="/profile/register" replace />
  }

  return <Outlet />
}

export default RegistrationRoute