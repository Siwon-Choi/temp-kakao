import { create } from 'zustand'
import { DEFAULT_SCHOOL_TYPE } from '../constants/schools'
import type { SchoolType } from '../types/school'

type MainPageState = {
  selectedType: SchoolType
  selectedSchoolId: number | null
  setSelectedType: (type: SchoolType) => void
  setSelectedSchoolId: (schoolId: number | null) => void
}

export const useMainPageStore = create<MainPageState>((set) => ({
  selectedType: DEFAULT_SCHOOL_TYPE,
  selectedSchoolId: null,
  setSelectedType: (selectedType) =>
    set({
      selectedType,
      selectedSchoolId: null,
    }),
  setSelectedSchoolId: (selectedSchoolId) => set({ selectedSchoolId }),
}))
