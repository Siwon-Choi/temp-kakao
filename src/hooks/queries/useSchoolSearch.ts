import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchSchools } from '../../api/schools'
import type { SchoolType } from '../../types/school'

const SEARCH_DEBOUNCE_MS = 400

export const useSchoolSearch = (selectedType: SchoolType, keyword: string) => {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword.trim())

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedKeyword(keyword.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [keyword])

  const query = useQuery({
    queryKey: ['schools', 'search', selectedType, debouncedKeyword],
    queryFn: () =>
      searchSchools({
        type: selectedType,
        keyword: debouncedKeyword,
      }),
    enabled: debouncedKeyword.length >= 1,
    retry: false,
  })

  return {
    ...query,
    debouncedKeyword,
    schools: query.data?.schools ?? [],
  }
}
