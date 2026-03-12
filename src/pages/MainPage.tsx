import { useEffect, useState } from 'react'
import styles from './styles/MainPage.module.css'
import MainHeader from '../components/main/MainHeader'
import SchoolSummaryCard from '../components/main/SchoolSummaryCard'
import SchoolMembersPanel from '../components/main/SchoolMembersPanel'
import { schoolLabelMap } from '../constants/schools'
import { useMe } from '../hooks/queries/useMe'
import { useSchools } from '../hooks/queries/useSchools'
import { useSchoolSearch } from '../hooks/queries/useSchoolSearch'
import { useSchoolMembers } from '../hooks/queries/useSchoolMembers'
import { useMainPageStore } from '../store/mainPageStore'
import type { SchoolSummary } from '../types/school'

function MainPage() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const selectedType = useMainPageStore((state) => state.selectedType)
  const selectedSchoolId = useMainPageStore((state) => state.selectedSchoolId)
  const setSelectedSchoolId = useMainPageStore((state) => state.setSelectedSchoolId)

  const meQuery = useMe()
  const schoolsQuery = useSchools(selectedType)
  const schoolSearchQuery = useSchoolSearch(selectedType, searchKeyword)

  const mySchool = meQuery.data?.schools.find((school) => school.type === selectedType) ?? null

  const visibleSchools =
    schoolSearchQuery.debouncedKeyword.length >= 1
      ? schoolSearchQuery.schools
      : schoolsQuery.data?.schools ?? []

  const otherSchools = visibleSchools.filter((school) => school.id !== mySchool?.id)

  const selectedSchool =
    (mySchool?.id === selectedSchoolId ? mySchool : null) ??
    visibleSchools.find((school) => school.id === selectedSchoolId) ??
    schoolsQuery.data?.schools.find((school) => school.id === selectedSchoolId) ??
    meQuery.data?.schools.find((school) => school.id === selectedSchoolId) ??
    null

  useEffect(() => {
    const isSelectedInVisibleList = selectedSchoolId !== null && visibleSchools.some((school) => school.id === selectedSchoolId)

    // 현재 보이는 학교가 있고 그게 아직 visible에 있는거면 그거 그대로 선택
    if (isSelectedInVisibleList) {
      return
    }
    // 선택된 학교가 내 학교가 아니면 내 학교를 기본으로 선택되게.
    if (mySchool && selectedSchoolId !== mySchool.id) {
      setSelectedSchoolId(mySchool.id)
      return
    }
    // 학교선택이 꼬였을 때의 처리. 첫 번째 학교를 포커싱하거나, 첫번째마저 없으면 그냥 선택안되게.
    const nextSchoolId = visibleSchools[0]?.id ?? null

    
    if (selectedSchoolId !== nextSchoolId) {
      setSelectedSchoolId(nextSchoolId)
    }
  }, [mySchool, selectedSchoolId, setSelectedSchoolId, visibleSchools])

  // 내 학교를 선택했나요?
  const isMySchoolSelected = mySchool?.id === selectedSchoolId

  const membersQuery = useSchoolMembers({
    schoolId: selectedSchoolId,
    enabled: isMySchoolSelected,
  })

  const handleSelectSchool = (school: SchoolSummary) => {
    setSelectedSchoolId(school.id)
    setSearchKeyword(school.name)
  }

  return (
    <div className={styles.page}>
      <MainHeader
        keyword={searchKeyword}
        searchResults={schoolSearchQuery.schools}
        isSearchLoading={schoolSearchQuery.isFetching}
        mySchoolId={mySchool?.id ?? null}
        onKeywordChange={setSearchKeyword}
        onSelectSchool={handleSelectSchool}
      />

      <section className={styles.topSection}>
        <div className={styles.listColumn}>
          {mySchool && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHead}>
                <h2>내 {schoolLabelMap[selectedType]}</h2>
                <p>인증된 학교가 있으면 항상 최상단에 둡니다.</p>
              </div>
              <SchoolSummaryCard
                school={mySchool}
                isSelected={selectedSchoolId === mySchool.id}
                badgeText="내 학교"
                onClick={setSelectedSchoolId}
              />
            </div>
          )}

          <div className={styles.sectionBlock}>
            <div className={styles.sectionHead}>
              <h2>학교 리스트</h2>
              <p>
                {schoolSearchQuery.debouncedKeyword.length >= 1
                  ? '검색 결과를 먼저 보여주는 상태입니다.'
                  : '기본 학교 리스트를 보여주는 상태입니다.'}
              </p>
            </div>

            {schoolsQuery.isLoading && (
              <div className={styles.messageCard}>학교 목록을 불러오는 중입니다.</div>
            )}

            {!schoolsQuery.isLoading && otherSchools.length === 0 && (
              <div className={styles.messageCard}>표시할 학교가 없습니다.</div>
            )}

            <div className={styles.schoolList}>
              {otherSchools.map((school) => (
                <SchoolSummaryCard
                  key={school.id}
                  school={school}
                  isSelected={selectedSchoolId === school.id}
                  onClick={setSelectedSchoolId}
                />
              ))}
            </div>
          </div>
        </div>

        <section className={styles.detailCard}>
          <h2 className={styles.detailTitle}>선택 학교 상세</h2>

          {!selectedSchool && (
            <p className={styles.detailHelper}>선택된 학교가 없습니다.</p>
          )}

          {selectedSchool && (
            <>
              <div className={styles.detailImageWrap}>
                {selectedSchool.imageUrl ? (
                  <img
                    className={styles.detailImage}
                    src={selectedSchool.imageUrl}
                    alt={`${selectedSchool.name} 대표 이미지`}
                  />
                ) : (
                  <div className={styles.detailFallback}>{selectedSchool.name.slice(0, 1)}</div>
                )}
              </div>
              <strong className={styles.schoolName}>{selectedSchool.name}</strong>
              <p className={styles.schoolType}>{schoolLabelMap[selectedSchool.type]}</p>
              <p className={styles.schoolAddress}>{selectedSchool.address}</p>
            </>
          )}

          {meQuery.isError && (
            <p className={styles.detailNotice}>
              `/api/users/me` 응답이 없으면 내 학교 영역은 숨기고 일반 학교 목록만 보이게 처리하면 됩니다.
            </p>
          )}
        </section>
      </section>

      <div className={styles.membersSection}>
        <SchoolMembersPanel
          canShowMembers={isMySchoolSelected}
          isVerified={Boolean(mySchool)}
          isLoading={membersQuery.isLoading}
          members={membersQuery.data?.members ?? []}
          selectedSchoolName={selectedSchool?.name ?? null}
        />
      </div>
    </div>
  )
}

export default MainPage
