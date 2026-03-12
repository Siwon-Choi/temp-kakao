import { useQuery } from '@tanstack/react-query'
import { getSchools } from '../../api/schools'
import type { SchoolType } from '../../types/school'

export const useSchools = (selectedType: SchoolType) =>
  useQuery({
    queryKey: ['schools', selectedType],
    queryFn: () => getSchools({ type: selectedType }),
    retry: false,
  })
