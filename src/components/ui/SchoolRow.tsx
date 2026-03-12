import style from '../styles/SchoolRow.module.css'

type Props = {
  name: string;
  region: string;
  image: string;
}

const SchoolRow = ({ name, region, image }: Props) => {
  return (
    <div className={style.schoolRow}>
      <div className={style.left}>
        <div className={style.info}>
          <div className={style.name}>{name}</div>
          <div className={style.region}>{region}</div>
        </div>
        <button className={style.register}>학교 인증하기</button>
        {/* 등록이 되었을 시, 인증 버튼은 사라지도록 설계 */}
      </div>

      <div className={style.right}>
        <img className={style.schoolImage} src={image} alt={`${name} 학교 이미지`} />
      </div>
    </div>
  )
}

export default SchoolRow;
