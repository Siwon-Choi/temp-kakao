import AlumniCard from '../components/ui/AlumniCard'
import favicon from '../assets/icons/school_dummy.jpeg'


const alumni = [
  {
    name: '김바보',
    photoUrl: favicon,
    school: {
      element: {
        name: '서울',
        graduation: 2010
      },
      middle: {
        name: '일본',
        graduation: 2013
      },
      high: {
        name: '중국',
        graduation: 2016
      }
    },
    region: '서울시 관악구',
    email: 'hyundai@autoever.com',
    phone: '010-1234-5678'

  }
]

function AlumniListPage() {
  return (
    <section className="">
      <div className="">
        <main className="">
          <section className="">
            <div className="">
              <strong>가고등학교</strong>
              <span>학교 소재지</span>
            </div>
            <div className="" />
          </section>

          <h3 className="">동창 리스트</h3>

          <section className="">
            {alumni.map((person, idx) => (
              <AlumniCard key={`${person.name}-${idx}`} 
              name={person.name}
              photoUrl={favicon}
              school={person.school}
              region={person.region}
              email={person.email}
              phone={person.phone}
              />
            ))}
            <div className="" />
            <div className="" />
            <div className="" />
            <div className="" />
          </section>
        </main>
        <main>

        </main>
      </div>
    </section>
  )
}

export default AlumniListPage
