import { apiRequest } from './client'

export type SchoolType = 'elementary' | 'middle' | 'high'

export type MemberProfile = {
  id: number
  name: string
  phone: string
  address: string
  profileImageUrl: string | null
}

export type SchoolRecord = {
  id: number
  type: SchoolType
  name: string
  address: string
}

export type VerifiedSchool = {
  schoolId: number
  type: SchoolType
  name: string
  address: string
  graduationYear: number
  certificateFileName: string
}

export type SchoolVerificationInput = {
  type: SchoolType
  region: string
  schoolName: string
  graduationYear: number
  certificate: File
}

export type UpdateProfileInput = {
  name: string
  phone: string
  address: string
}

export type UpsertSchoolVerificationResult = {
  linkedSchool: VerifiedSchool
  mode: 'linked-existing' | 'created-and-linked'
}

type UserSchoolResponse = {
  id: number
  type: SchoolType
  graduationYear: number
  name: string
  imageUrl: string | null
  address: string
  createdAt: string
}

type UserMeResponse = {
  id: number
  email: string
  name: string
  phone: string | null
  address: string | null
  createdAt: string
  schools: UserSchoolResponse[]
}

type LinkedSchoolResponse = {
  id: number
  type: SchoolType
  graduationYear: number
  name: string
  imageUrl: string | null
  address: string
  createdAt: string
}

async function fetchUserMe(): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>('/api/users/me', { auth: true })
}

function mapSchoolToVerifiedSchool(school: UserSchoolResponse): VerifiedSchool {
  return {
    schoolId: school.id,
    type: school.type,
    name: school.name,
    address: school.address,
    graduationYear: school.graduationYear,
    certificateFileName: '',
  }
}

function mapLinkedSchoolToVerifiedSchool(school: LinkedSchoolResponse): VerifiedSchool {
  return {
    schoolId: school.id,
    type: school.type,
    name: school.name,
    address: school.address,
    graduationYear: school.graduationYear,
    certificateFileName: '',
  }
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('ko-KR')
}

function findMatchedSchool(candidates: SchoolRecord[], schoolName: string): SchoolRecord | undefined {
  const normalizedName = normalizeText(schoolName)
  return candidates.find((school) => normalizeText(school.name) === normalizedName)
}

export async function fetchMemberProfile(): Promise<MemberProfile> {
  const data = await fetchUserMe()
  return {
    id: data.id,
    name: data.name,
    phone: data.phone ?? '',
    address: data.address ?? '',
    profileImageUrl: null,
  }
}

export async function updateMemberProfile(input: UpdateProfileInput): Promise<MemberProfile> {
  const data = await apiRequest<{
    id: number
    name: string
    phone: string | null
    address: string | null
  }>('/api/users/me', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      address: input.address,
    }),
  })

  return {
    id: data.id,
    name: data.name,
    phone: data.phone ?? '',
    address: data.address ?? '',
    profileImageUrl: null,
  }
}

export async function searchSchoolList(type: SchoolType, schoolName: string): Promise<SchoolRecord[]> {
  const keyword = schoolName.trim()
  const query = new URLSearchParams({ keyword })
  const data = await apiRequest<Array<{
    id: number
    name: string
    type: SchoolType
    address: string
  }>>(`/api/schools/search?${query.toString()}`)

  return data.filter((school) => school.type === type)
}

export async function connectExistingSchool(school: SchoolRecord, input: SchoolVerificationInput): Promise<VerifiedSchool> {
  const linkedSchool = await apiRequest<LinkedSchoolResponse>(`/api/users/schools/${input.type}/link`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      id: school.id,
      graduationYear: input.graduationYear,
    }),
  })
  return mapLinkedSchoolToVerifiedSchool(linkedSchool)
}

export async function createSchoolAndConnect(input: SchoolVerificationInput): Promise<VerifiedSchool> {
  const linkedSchool = await apiRequest<LinkedSchoolResponse>(`/api/users/schools/${input.type}/new`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      name: input.schoolName,
      address: input.region,
      graduationYear: input.graduationYear,
    }),
  })
  return mapLinkedSchoolToVerifiedSchool(linkedSchool)
}

export async function upsertSchoolVerification(input: SchoolVerificationInput): Promise<UpsertSchoolVerificationResult> {
  const schoolCandidates = await searchSchoolList(input.type, input.schoolName)
  const matchedSchool = findMatchedSchool(schoolCandidates, input.schoolName)

  if (matchedSchool) {
    const linkedSchool = await connectExistingSchool(matchedSchool, input)
    return {
      linkedSchool,
      mode: 'linked-existing',
    }
  }

  const linkedSchool = await createSchoolAndConnect(input)
  return {
    linkedSchool,
    mode: 'created-and-linked',
  }
}

export async function fetchVerifiedSchools(): Promise<VerifiedSchool[]> {
  const data = await fetchUserMe()
  return data.schools.map(mapSchoolToVerifiedSchool)
}
