import type { SchoolSummary, SchoolType } from '../types/school'

export const SCHOOL_TABS = [
  { key: 'elementary', label: '초등학교' },
  { key: 'middle', label: '중학교' },
  { key: 'high', label: '고등학교' },
] as const

export const DEFAULT_SCHOOL_TYPE: SchoolType = 'elementary'
export const DEFAULT_SCHOOL_PATH = '/'

export const schoolLabelMap: Record<SchoolType, string> = {
  elementary: '초등학교',
  middle: '중학교',
  high: '고등학교',
}

export type School = Pick<SchoolSummary, 'name'> & {
  region: string
  image: string
}

export const schoolMap: Record<SchoolType, School[]> = {
  elementary: [],
  middle: [],
  high: [],
}

export const isSchoolType = (value: string | undefined): value is SchoolType =>
  SCHOOL_TABS.some((tab) => tab.key === value)
