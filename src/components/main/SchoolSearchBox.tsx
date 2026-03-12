import { useState } from 'react'
import styles from './styles/SchoolSearchBox.module.css'
import type { SchoolSummary } from '../../types/school'

type Props = {
  keyword: string
  schools: SchoolSummary[]
  isLoading: boolean
  mySchoolId: number | null
  onKeywordChange: (value: string) => void
  onSelectSchool: (school: SchoolSummary) => void
}

function SchoolSearchBox({
  keyword,
  schools,
  isLoading,
  mySchoolId,
  onKeywordChange,
  onSelectSchool,
}: Props) {
  const [isFocused, setIsFocused] = useState(false)
  const showDropdown = isFocused && keyword.trim().length >= 1

  return (
    <div className={styles.searchBox}>
      <input
        className={styles.input}
        value={keyword}
        placeholder="학교 이름 검색"
        onChange={(event) => onKeywordChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          window.setTimeout(() => setIsFocused(false), 120)
        }}
      />

      {showDropdown && (
        <div className={styles.dropdown}>
          {isLoading && <div className={styles.stateRow}>검색 중...</div>}

          {!isLoading && schools.length === 0 && (
            <div className={styles.stateRow}>검색 결과가 없습니다.</div>
          )}

          {!isLoading &&
            schools.map((school) => (
              <button
                key={school.id}
                type="button"
                className={styles.option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onSelectSchool(school)
                  setIsFocused(false)
                }}
              >
                <div className={styles.optionName}>
                  {school.name}
                  {mySchoolId === school.id && <span className={styles.badge}>내 학교</span>}
                </div>
                <div className={styles.optionMeta}>{school.address}</div>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default SchoolSearchBox
