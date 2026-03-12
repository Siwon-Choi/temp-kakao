// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { clearAuthSession, markUserRegistered, readAuthSession, requestUserSignup } from '../api/auth'
// import style from './styles/ProfileRegisterPage.module.css'

// type Props = {
//   onComplete: () => void
//   onCancel: () => void
// }

// function ProfileRegisterPage({ onComplete, onCancel }: Props) {
//   const navigate = useNavigate()
//   const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     const session = readAuthSession()
//     if (!session) {
//       setErrorMessage('로그인 세션이 없습니다. 다시 로그인해주세요.')
//       navigate('/login', { replace: true })
//       return
//     }

//     setIsSubmitting(true)
//     setErrorMessage(null)

//     try {
//       await requestUserSignup(
//         {
//           email: form.email,
//           name: form.name,
//           phone: form.phone || undefined,
//           address: form.address || undefined,
//         },
//         session.accessToken,
//       )

//       markUserRegistered(session)
//       onComplete()
//       navigate('/', { replace: true })
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : '회원가입 요청 중 오류가 발생했습니다.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleCancel = () => {
//     clearAuthSession()
//     onCancel()
//     navigate('/login', { replace: true })
//   }

//   return (
//     <div className={style.pageWrap}>
//       <form className={style.card} onSubmit={handleSubmit}>
//         <div className={style.brand}>RE:CALL</div>
//         <p className={style.subtitle}>추억을 다시 연결하기 위한 마지막 단계예요.</p>

//         <div className={style.avatarWrap}>
//           <div className={style.avatar}>R</div>
//           <button type="button" className={style.uploadButton}>
//             프로필 사진 등록
//           </button>
//         </div>

//         <div className={style.inputGrid}>
//           <label className={style.inputLabel}>
//             이름
//             <input
//               value={form.name}
//               onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
//               className={style.input}
//               placeholder="이름을 입력해주세요"
//               required
//               maxLength={20}
//             />
//           </label>

//           <label className={style.inputLabel}>
//             이메일
//             <input
//               value={form.email}
//               onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
//               className={style.input}
//               placeholder="이메일을 입력해주세요"
//               type="email"
//               required
//             />
//           </label>

//           <label className={style.inputLabel}>
//             휴대폰 번호
//             <input
//               value={form.phone}
//               onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\s+/g, '') }))}
//               className={style.input}
//               placeholder="01012345678"
//               maxLength={11}
//             />
//           </label>

//           <label className={style.inputLabel}>
//             주소지
//             <input
//               value={form.address}
//               onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
//               className={style.input}
//               placeholder="예: 인천광역시 연수구"
//             />
//           </label>
//         </div>

//         {errorMessage && <p style={{ color: '#d4380d', width: 'min(560px, 100%)' }}>{errorMessage}</p>}

//         <div className={style.actions}>
//           <button type="button" className={style.cancelButton} onClick={handleCancel} disabled={isSubmitting}>
//             취소
//           </button>
//           <button type="submit" className={style.submitButton} disabled={isSubmitting}>
//             {isSubmitting ? '가입 처리 중...' : '가입 완료'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default ProfileRegisterPage


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthSession, markUserRegistered, readAuthSession, requestUserSignup } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import style from './styles/ProfileRegisterPage.module.css'

function ProfileRegisterPage() {
  const navigate = useNavigate()
  const clearTokens = useAuthStore((state) => state.clearTokens)
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const session = readAuthSession()
    if (!session) {
      setErrorMessage('로그인 세션이 없습니다. 다시 로그인해주세요.')
      clearTokens()
      navigate('/login', { replace: true })
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await requestUserSignup(
        {
          email: form.email,
          name: form.name,
          phone: form.phone || undefined,
          address: form.address || undefined,
        },
        session.accessToken,
      )

      const nextSession = markUserRegistered(session)

      setAuth({
        accessToken: nextSession.accessToken,
        refreshToken: nextSession.refreshToken,
        isRegistered: true,
      })

      navigate('/', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입 요청 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    clearAuthSession()
    clearTokens()
    navigate('/login', { replace: true })
  }

  return (
    <div className={style.pageWrap}>
      <form className={style.card} onSubmit={handleSubmit}>
        <div className={style.brand}>RE:CALL</div>
        <p className={style.subtitle}>추억을 다시 연결하기 위한 마지막 단계예요.</p>

        <div className={style.avatarWrap}>
          <div className={style.avatar}>R</div>
          <button type="button" className={style.uploadButton}>
            프로필 사진 등록
          </button>
        </div>

        <div className={style.inputGrid}>
          <label className={style.inputLabel}>
            이름
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={style.input}
              placeholder="이름을 입력해주세요"
              required
              maxLength={20}
            />
          </label>

          <label className={style.inputLabel}>
            이메일
            <input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className={style.input}
              placeholder="이메일을 입력해주세요"
              type="email"
              required
            />
          </label>

          <label className={style.inputLabel}>
            휴대폰 번호
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\s+/g, '') }))}
              className={style.input}
              placeholder="01012345678"
              maxLength={11}
            />
          </label>

          <label className={style.inputLabel}>
            주소지
            <input
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              className={style.input}
              placeholder="예: 인천광역시 연수구"
            />
          </label>
        </div>

        {errorMessage && <p style={{ color: '#d4380d', width: 'min(560px, 100%)' }}>{errorMessage}</p>}

        <div className={style.actions}>
          <button type="button" className={style.cancelButton} onClick={handleCancel} disabled={isSubmitting}>
            취소
          </button>
          <button type="submit" className={style.submitButton} disabled={isSubmitting}>
            {isSubmitting ? '가입 처리 중...' : '가입 완료'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileRegisterPage