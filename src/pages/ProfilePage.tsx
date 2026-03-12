import SchoolAdd from '../components/ui/SchoolAdd'
import favicon from '../assets/icons/jaewon-favicon.png'
import style from './styles/ProfilePage.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthSession } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { fetchMemberProfile, updateMemberProfile, upsertSchoolVerification } from '../api/profileEdit'
import type { SchoolType, UpsertSchoolVerificationResult } from '../api/profileEdit'

type ProfileForm = {
  name: string
  phone: string
  address: string
}

type ProfilePayload = ProfileForm & {
  profileImage: File | null
}

type SchoolPayload = {
  [key in SchoolType]: {
    region: string
    name: string
    graduationYear: number | null
    certificate: File | null
  }
}

function ProfilePage() {
  const navigate = useNavigate()
  const clearTokens = useAuthStore((state) => state.clearTokens)
  const queryClient = useQueryClient()

  const [profileForm, setProfileForm] = useState<ProfileForm>({ name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const profileMutation = useMutation({
    mutationFn: async (payload: ProfilePayload) => updateMemberProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileFetch'] })
      setMessage('프로필 정보가 저장되었습니다.')
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : '프로필 저장에 실패했습니다.')
    },
  })

  const schoolMutation = useMutation({
    mutationFn: async (payload: SchoolPayload) => {
      const schoolTypes: SchoolType[] = ['elementary', 'middle', 'high']
      const savedResults: UpsertSchoolVerificationResult[] = []

      for (const type of schoolTypes) {
        const school = payload[type]
        const hasAnyInput = Boolean(school.region || school.name || school.graduationYear || school.certificate)
        if (!hasAnyInput) {
          continue
        }

        if (!school.region || !school.name || !school.graduationYear || !school.certificate) {
          throw new Error('학교 정보를 입력한 항목은 소재지, 학교명, 졸업년도, 졸업증명서를 모두 입력해주세요.')
        }

        const result = await upsertSchoolVerification({
          type,
          region: school.region,
          schoolName: school.name,
          graduationYear: school.graduationYear,
          certificate: school.certificate,
        })

        savedResults.push(result)
      }

      if (savedResults.length === 0) {
        throw new Error('등록할 학교 정보를 먼저 입력해주세요.')
      }

      return savedResults
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['SchoolUpdate'] })
      const linkedCount = results.filter((item) => item.mode === 'linked-existing').length
      const createdCount = results.filter((item) => item.mode === 'created-and-linked').length
      setMessage(`학교 인증 저장 완료 (기존 학교 연결 ${linkedCount}건, 신규 생성 후 연결 ${createdCount}건)`)
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : '학교 인증 저장에 실패했습니다.')
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const profile = await fetchMemberProfile()
        setProfileForm({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        })
      } catch (error) {
        setMessage(error instanceof Error ? error.message : '프로필 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [])

  const getString = (formData: FormData, key: string) => String(formData.get(key) ?? '')

  const getFile = (formData: FormData, key: string) => {
    const value = formData.get(key)
    return value instanceof File && value.size > 0 ? value : null
  }

  const getNumber = (formData: FormData, key: string) => {
    const value = String(formData.get(key) ?? '').trim()
    if (!value) return null
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleProfileImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleProfileSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setMessage('')

    const formData = new FormData(e.currentTarget)

    const payload: ProfilePayload = {
      name: profileForm.name,
      phone: profileForm.phone,
      address: profileForm.address,
      profileImage: getFile(formData, 'profileImage'),
    }

    profileMutation.mutate(payload)
  }

  const handleSchoolSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setMessage('')
    const formData = new FormData(e.currentTarget)

    const payload: SchoolPayload = {
      elementary: {
        region: getString(formData, 'elementaryRegion'),
        name: getString(formData, 'elementaryName'),
        graduationYear: getNumber(formData, 'elementaryGraduationYear'),
        certificate: getFile(formData, 'elementaryCertificate'),
      },
      middle: {
        region: getString(formData, 'middleRegion'),
        name: getString(formData, 'middleName'),
        graduationYear: getNumber(formData, 'middleGraduationYear'),
        certificate: getFile(formData, 'middleCertificate'),
      },
      high: {
        region: getString(formData, 'highRegion'),
        name: getString(formData, 'highName'),
        graduationYear: getNumber(formData, 'highGraduationYear'),
        certificate: getFile(formData, 'highCertificate'),
      },
    }

    schoolMutation.mutate(payload)
  }

  const handleLogout = () => {
    clearAuthSession()
    clearTokens()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return <div className={style.sectionDivider}>프로필 정보를 불러오는 중...</div>
  }

  return (
    <div className="">
      <form onSubmit={handleProfileSubmit}>
        <section className={style.sectionDivider}>
          <div className={style.sectionTitle}>내 프로필 수정</div>
          <div className={style.profileEdit}>
            <div className={style.profileDivider}>
              <img className={style.profilePhoto} src={previewUrl ?? favicon} alt="프로필 미리보기" />
              <div>
                <input type="file" name="profileImage" accept="image/*" onChange={handleProfileImageChange} />
              </div>
            </div>

            <div className="">
              <div>
                <label>
                  이름 :
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="이름을 입력해주세요."
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </label>
              </div>
              <div>
                <label>
                  전화번호 :
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="전화번호를 입력해주세요."
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </label>
              </div>
              <div>
                <label>
                  지역 :
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="지역을 입력해주세요."
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className={style.saveProfile}>
            <button type="submit" value="saveProfile" disabled={profileMutation.isPending}>
              {profileMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </section>
      </form>

      <form onSubmit={handleSchoolSubmit}>
        <section className={style.sectionDivider}>
          <div className={style.sectionTitle}>학교 등록</div>
          <div className={style.schoolResister}>
            <SchoolAdd name="초등학교" fieldPrefix="elementary" />
            <SchoolAdd name="중학교" fieldPrefix="middle" />
            <SchoolAdd name="고등학교" fieldPrefix="high" />
          </div>

          <div className={style.saveProfile}>
            <button type="submit" value="schoolResister" disabled={schoolMutation.isPending}>
              {schoolMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </section>
      </form>

      {message && <section className={style.sectionDivider}>{message}</section>}

      <section className={style.sectionDivider}>
        <div className={style.sectionTitle}>계정</div>
        <div className={style.saveProfile}>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
