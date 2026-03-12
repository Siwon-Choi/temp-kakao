import styles from './styles/SchoolMembersPanel.module.css'
import type { SchoolMember } from '../../types/school'

type Props = {
  canShowMembers: boolean
  isVerified: boolean
  isLoading: boolean
  members: SchoolMember[]
  selectedSchoolName: string | null
}

function SchoolMembersPanel({
  canShowMembers,
  isVerified,
  isLoading,
  members,
  selectedSchoolName,
}: Props) {
  if (!canShowMembers) {
    return (
      <section className={styles.panel}>
        <h3 className={styles.title}>멤버 영역</h3>

        {!isVerified && (
          <div className={styles.messageBox}>
            <strong>학교 인증 유도 영역</strong>
            <p>
              내 학교 인증이 없으면 멤버 리스트 대신 학교 인증 안내를 두는 편이 가장 안전합니다.
            </p>
          </div>
        )}

        {isVerified && (
          <div className={styles.messageBox}>
            <strong>정보 강조 영역</strong>
            <p>
              {selectedSchoolName ? `${selectedSchoolName} 기본 정보만 강조해서 보여주고` : '선택한 학교의 기본 정보만'}
              멤버 영역은 숨기는 구성이 가장 현실적입니다.
            </p>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className={styles.panel}>
      <h3 className={styles.title}>학교 멤버</h3>

      {isLoading && <p className={styles.helper}>멤버를 불러오는 중입니다.</p>}

      {!isLoading && members.length === 0 && (
        <p className={styles.helper}>표시할 멤버가 없습니다.</p>
      )}

      {!isLoading && members.length > 0 && (
        <ul className={styles.memberList}>
          {members.map((member) => (
            <li key={member.id} className={styles.memberItem}>
              <strong>{member.name}</strong>
              <span>{member.graduationYear}년 졸업</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SchoolMembersPanel
