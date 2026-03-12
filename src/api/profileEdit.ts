export type Member = {
  id: number
  name: string
  phone: string | null
  address: string | null
  graduationYear: number | null
  elementarySchoolName: string | null
  middleSchoolName: string | null
  highSchoolName: string | null
}

type MembersResponse = {
  members: Member[]
}

type ExistingSchoolRequest = {
  contentType: 'exist'
  id: number
  graduationYear: number
}

type NewSchoolRequest = {
  contentType: 'new'
  name: string
  type: 'elementary' | 'middle' | 'high'
  address: string
}

export type CreateProfileRequest = {
  name: string
  phone: string
  address: string
  schools: Array<ExistingSchoolRequest | NewSchoolRequest>
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')

function apiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not set')
  }
  return `${API_BASE_URL}${path}`
}

export async function getProfiles(): Promise<Member[]> {
  const res = await fetch(apiUrl('/api/schools/0/members'))
  if (!res.ok) throw new Error('api 호출 실패')
  const data = (await res.json()) as MembersResponse
  return data.members
}

export async function postUserProfile(payload: CreateProfileRequest) {
  const res = await fetch(apiUrl('/api/users/profiles'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('프로필 저장 실패')
  }

  return res.json()
}
