import { readAuthSession } from './auth'

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

function readAccessToken(): string {
  const session = readAuthSession()
  if (!session?.accessToken) {
    throw new Error('로그인 세션이 없습니다. 다시 로그인해주세요.')
  }
  return session.accessToken
}

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const accessToken = readAccessToken()
  const hasMultipartBody = typeof FormData !== 'undefined' && init.body instanceof FormData

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      ...(hasMultipartBody ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `API 요청 실패: ${response.status}`)
  }

  return response
}

async function fetchUserMe(): Promise<UserMeResponse> {
  const response = await authorizedFetch('/api/users/me', { method: 'GET' })
  return response.json() as Promise<UserMeResponse>
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
  const response = await authorizedFetch('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      address: input.address,
    }),
  })

  const data = (await response.json()) as {
    id: number
    name: string
    phone: string | null
    address: string | null
  }

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
  const response = await authorizedFetch(`/api/schools/search?${query.toString()}`, { method: 'GET' })
  const data = (await response.json()) as Array<{
    id: number
    name: string
    type: SchoolType
    address: string
  }>

  return data.filter((school) => school.type === type)
}

export async function connectExistingSchool(school: SchoolRecord, input: SchoolVerificationInput): Promise<VerifiedSchool> {
  const response = await authorizedFetch(`/api/users/schools/${input.type}/link`, {
    method: 'POST',
    body: JSON.stringify({
      id: school.id,
      graduationYear: input.graduationYear,
    }),
  })

  const linkedSchool = (await response.json()) as LinkedSchoolResponse
  return mapLinkedSchoolToVerifiedSchool(linkedSchool)
}

export async function createSchoolAndConnect(input: SchoolVerificationInput): Promise<VerifiedSchool> {
  const response = await authorizedFetch(`/api/users/schools/${input.type}/new`, {
    method: 'POST',
    body: JSON.stringify({
      name: input.schoolName,
      address: input.region,
      graduationYear: input.graduationYear,
    }),
  })

  const linkedSchool = (await response.json()) as LinkedSchoolResponse
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
