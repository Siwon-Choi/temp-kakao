import { useQuery } from '@tanstack/react-query'
import { getMe } from '../../api/users'
import { useAuthStore } from '../../store/authStore'

export const useMe = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated,
    retry: false,
  })
}
