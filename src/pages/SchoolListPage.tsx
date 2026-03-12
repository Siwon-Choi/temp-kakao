import SchoolRow from '../components/ui/SchoolRow'
import style from '../pages/styles/SchoolListPage.module.css'
import { Navigate, useParams } from 'react-router-dom'
import { isSchoolType, schoolLabelMap, schoolMap } from '../constants/schools'

function SchoolListPage() {
  const { schoolType } = useParams()

  if (!isSchoolType(schoolType)) {
    return <Navigate to="/login" replace />
  }

  const schools = schoolMap[schoolType]
  const currentLabel = schoolLabelMap[schoolType]

  return (
    <div className={style.mainContainer}>
      <section className={style.pageHeader}>
        <h1 className={style.pageTitle}>{currentLabel} 동창 찾기</h1>
        <p className={style.pageDescription}>
          학교를 선택해서 인증하고, 같은 학교 친구들을 찾아보세요.
        </p>
      </section>
      <main className={style.main}>
        {schools.map((school) => (
          <SchoolRow
            key={school.name}
            name={school.name}
            region={school.region}
            image={school.image}
          />
        ))}
      </main>
    </div>
  )
}

export default SchoolListPage
