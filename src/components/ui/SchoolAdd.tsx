import style from '../styles/SchoolAdd.module.css'

type Props = {
    name: string
    fieldPrefix: string
}

const SchoolAdd = ({ name, fieldPrefix }: Props) => {


    return (
        <div className={style.schoolResistDivider} style={name === '초등학교' ? {borderWidth:'0px'} : undefined}>
            <div className={style.schoolDivider}>{name}</div>
            <div>
                <div className={style.schoolAdd}>
                    소재지
                    <input type='text' name={`${fieldPrefix}Region`} placeholder='학교 소재지 입력' />
                </div>
                <div className={style.schoolAdd}>
                    학교명
                    <input type='text' name={`${fieldPrefix}Name`} placeholder='학교명 입력' />
                </div>
                <div className={style.schoolAdd}>
                    졸업년도
                    <input type='number' name={`${fieldPrefix}GraduationYear`} placeholder='졸업년도 4자리 입력' min={1950} max={2026} />
                </div>
                <div className={style.schoolAdd}>
                    졸업증명서
                    <input type='file' name={`${fieldPrefix}Certificate`} />
                </div>
            </div>
        </div>
    )
}

export default SchoolAdd;
