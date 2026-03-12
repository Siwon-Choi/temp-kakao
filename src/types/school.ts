export type SchoolType = 'elementary' | 'middle' | 'high'

export type SchoolSummary = {
  id: number
  type: SchoolType
  name: string
  imageUrl?: string | null
  address: string
  createdAt?: string
}

export type MySchool = SchoolSummary & {
  graduationYear: number
}

export type SchoolMember = {
  id: number
  name: string
  phone?: string | null
  address?: string | null
  graduationYear: number
  elementarySchoolName?: string | null
  middleSchoolName?: string | null
  highSchoolName?: string | null
}

export type MeResponse = {
  id: number
  email: string
  name: string
  phone?: string | null
  address?: string | null
  createdAt: string
  schools: MySchool[]
}
