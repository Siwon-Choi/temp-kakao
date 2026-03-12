import styles from './styles/MainHeader.module.css'
import SchoolSearchBox from './SchoolSearchBox'
import SchoolTypeTabs from './SchoolTypeTabs'
import type { SchoolSummary } from '../../types/school'

type Props = {
  keyword: string
  searchResults: SchoolSummary[]
  isSearchLoading: boolean
  mySchoolId: number | null
  onKeywordChange: (value: string) => void
  onSelectSchool: (school: SchoolSummary) => void
}

function MainHeader({
  keyword,
  searchResults,
  isSearchLoading,
  mySchoolId,
  onKeywordChange,
  onSelectSchool,
}: Props) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>전국 동창생 커뮤니티 RE:CALL</p>
        <p className={styles.description}>
          찾고 싶은 추억의 학교를 검색해보세요.
        </p>
      </div>

      <div className={styles.controls}>
        <SchoolSearchBox
          keyword={keyword}
          schools={searchResults}
          isLoading={isSearchLoading}
          mySchoolId={mySchoolId}
          onKeywordChange={onKeywordChange}
          onSelectSchool={onSelectSchool}
        />
        <SchoolTypeTabs />
      </div>
    </header>
  )
}

export default MainHeader
