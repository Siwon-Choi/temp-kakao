import { useQuery } from '@tanstack/react-query'
import { getSchoolMembers } from '../../api/schools'
import { useAuthStore } from '../../store/authStore'

type UseSchoolMembersParams = {
  schoolId: number | null
  enabled: boolean
}

export const useSchoolMembers = ({ schoolId, enabled }: UseSchoolMembersParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['school-members', schoolId],
    queryFn: () => getSchoolMembers(schoolId as number),
    enabled: Boolean(schoolId) && enabled && isAuthenticated,
    retry: false,
  })
}
