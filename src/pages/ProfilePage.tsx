import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import favicon from '../assets/icons/jaewon-favicon.png'
import schoolDummy from '../assets/icons/school_dummy.jpeg'
import style from './styles/ProfilePage.module.css'
import {
  connectExistingSchool,
  createSchoolAndConnect,
  fetchMemberProfile,
  fetchVerifiedSchools,
  searchSchoolList,
  updateMemberProfile,
} from '../api/profileEdit'
import type { SchoolType, VerifiedSchool } from '../api/profileEdit'
import { clearAuthSession } from '../api/auth'
import { useAuthStore } from '../store/authStore'

type ProfileForm = {
  name: string
  phone: string
  address: string
}

type SchoolForm = {
  type: SchoolType
  region: string
  schoolName: string
  graduationYear: string
  certificate: File | null
}

const schoolTypeLabel: Record<SchoolType, string> = {
  elementary: '초등학교',
  middle: '중학교',
  high: '고등학교',
}

const schoolTypeOrder: SchoolType[] = ['elementary', 'middle', 'high']

function ProfilePage() {
  const navigate = useNavigate()
  const clearTokens = useAuthStore((state) => state.clearTokens)

  const [profileForm, setProfileForm] = useState<ProfileForm>({ name: '', phone: '', address: '' })
  const [schoolForm, setSchoolForm] = useState<SchoolForm>({
    type: 'elementary',
    region: '',
    schoolName: '',
    graduationYear: '',
    certificate: null,
  })
  const [verifiedSchools, setVerifiedSchools] = useState<VerifiedSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [schoolSaving, setSchoolSaving] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const [profile, schools] = await Promise.all([fetchMemberProfile(), fetchVerifiedSchools()])
        setProfileForm({ name: profile.name, phone: profile.phone, address: profile.address })
        setVerifiedSchools(schools)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : '프로필 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    void init()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const verifiedSchoolMap = useMemo(
    () =>
      verifiedSchools.reduce<Record<SchoolType, VerifiedSchool | undefined>>(
        (acc, school) => ({ ...acc, [school.type]: school }),
        {
          elementary: undefined,
          middle: undefined,
          high: undefined,
        },
      ),
    [verifiedSchools],
  )

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setProfileSaving(true)
      setMessage('')

      await updateMemberProfile(profileForm)
      setMessage('프로필 정보가 저장되었습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleSchoolSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!schoolForm.certificate) {
      setMessage('졸업증명서 파일을 업로드해주세요.')
      return
    }

    const graduationYear = Number(schoolForm.graduationYear)
    if (!graduationYear || Number.isNaN(graduationYear)) {
      setMessage('졸업년도를 정확히 입력해주세요.')
      return
    }

    try {
      setSchoolSaving(true)
      setMessage('')

      const input = {
        type: schoolForm.type,
        region: schoolForm.region,
        schoolName: schoolForm.schoolName,
        graduationYear,
        certificate: schoolForm.certificate,
      }

      const schoolCandidates = await searchSchoolList(input.type, input.schoolName)
      const matchedSchool = schoolCandidates.find((school) => school.name === input.schoolName)

      const nextVerifiedSchools = matchedSchool
        ? await connectExistingSchool(matchedSchool, input)
        : await createSchoolAndConnect(input)

      setVerifiedSchools(nextVerifiedSchools)
      setSchoolForm((prev) => ({
        ...prev,
        region: '',
        schoolName: '',
        graduationYear: '',
        certificate: null,
      }))
      setMessage(
        matchedSchool
          ? '기존 학교를 찾아 인증 정보에 연결했습니다.'
          : '등록되지 않은 학교로 확인되어 학교를 생성하고 인증 정보에 연결했습니다.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '학교 인증 저장 중 오류가 발생했습니다.')
    } finally {
      setSchoolSaving(false)
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    clearTokens()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return <div className={style.loading}>프로필 정보를 불러오는 중...</div>
  }

  return (
    <div className={style.pageContainer}>
      <section className={style.sectionCard}>
        <h2 className={style.sectionTitle}>프로필 수정하기</h2>
        <form onSubmit={handleProfileSave} className={style.profileEditForm}>
          <div className={style.profileImageBlock}>
            <img className={style.profilePhoto} src={previewUrl ?? favicon} alt="프로필 미리보기" />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                if (previewUrl) URL.revokeObjectURL(previewUrl)
                setPreviewUrl(URL.createObjectURL(file))
              }}
            />
          </div>

          <div className={style.profileFields}>
            <label className={style.inputGroup}>
              이름
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="이름을 입력해주세요"
              />
            </label>

            <label className={style.inputGroup}>
              전화번호
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="전화번호를 입력해주세요"
              />
            </label>

            <label className={`${style.inputGroup} ${style.fullWidth}`}>
              주소지
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="주소지를 입력해주세요"
              />
            </label>
          </div>

          <div className={style.buttonRow}>
            <button type="submit" disabled={profileSaving}>
              {profileSaving ? '저장 중...' : '프로필 저장'}
            </button>
          </div>
        </form>
      </section>

      <section className={style.sectionCard}>
        <h2 className={style.sectionTitle}>학교 인증하기</h2>

        <div className={style.schoolTypeGrid}>
          {schoolTypeOrder.map((type) => {
            const verifiedSchool = verifiedSchoolMap[type]

            return (
              <div key={type} className={style.schoolTypeCard}>
                <div className={style.schoolTypeHeader}>
                  <h3>{schoolTypeLabel[type]}</h3>
                  {!verifiedSchool && (
                    <button
                      type="button"
                      className={style.addButton}
                      onClick={() => setSchoolForm((prev) => ({ ...prev, type }))}
                    >
                      +
                    </button>
                  )}
                </div>

                {verifiedSchool ? (
                  <div className={style.verifiedSchoolCard}>
                    <img src={schoolDummy} alt={`${verifiedSchool.name} 졸업증명서`} className={style.certificateImage} />
                    <div>
                      <p className={style.schoolName}>{verifiedSchool.name}</p>
                      <p className={style.schoolMeta}>{verifiedSchool.address}</p>
                      <p className={style.schoolMeta}>{verifiedSchool.graduationYear}년 졸업</p>
                    </div>
                  </div>
                ) : (
                  <p className={style.emptyText}>아직 인증 전입니다. + 버튼으로 등록해주세요.</p>
                )}
              </div>
            )
          })}
        </div>

        {!verifiedSchoolMap[schoolForm.type] && (
          <form onSubmit={handleSchoolSave} className={style.formGrid}>
            <label className={style.inputGroup}>
              학교 유형
              <select
                value={schoolForm.type}
                onChange={(e) => setSchoolForm((prev) => ({ ...prev, type: e.target.value as SchoolType }))}
              >
                <option value="elementary">초등학교</option>
                <option value="middle">중학교</option>
                <option value="high">고등학교</option>
              </select>
            </label>

            <label className={style.inputGroup}>
              소재지
              <input
                type="text"
                value={schoolForm.region}
                onChange={(e) => setSchoolForm((prev) => ({ ...prev, region: e.target.value }))}
                placeholder="학교 소재지 입력"
                required
              />
            </label>

            <label className={style.inputGroup}>
              학교명
              <input
                type="text"
                value={schoolForm.schoolName}
                onChange={(e) => setSchoolForm((prev) => ({ ...prev, schoolName: e.target.value }))}
                placeholder="학교명을 입력해주세요"
                required
              />
            </label>

            <label className={style.inputGroup}>
              졸업년도
              <input
                type="number"
                value={schoolForm.graduationYear}
                onChange={(e) => setSchoolForm((prev) => ({ ...prev, graduationYear: e.target.value }))}
                min={1950}
                max={2100}
                placeholder="예: 2017"
                required
              />
            </label>

            <label className={style.inputGroup}>
              졸업증명서
              <input
                type="file"
                onChange={(e) => setSchoolForm((prev) => ({ ...prev, certificate: e.target.files?.[0] ?? null }))}
                required
              />
            </label>

            <div className={style.buttonRow}>
              <button type="submit" disabled={schoolSaving}>
                {schoolSaving ? '저장 중...' : '학교 인증 저장'}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className={style.sectionCard}>
        <h2 className={style.sectionTitle}>계정</h2>
        <div className={style.buttonRow}>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </section>

      {message && <div className={style.messageBox}>{message}</div>}
    </div>
  )
}

export default ProfilePage
