import { Navigate, Outlet } from 'react-router-dom'
import { DEFAULT_SCHOOL_PATH } from '../../constants/schools'
import { useAuthStore } from '../../store/authStore'

function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={DEFAULT_SCHOOL_PATH} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
