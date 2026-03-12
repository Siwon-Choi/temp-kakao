import styles from './styles/SchoolSummaryCard.module.css'
import type { SchoolSummary } from '../../types/school'

type Props = {
  school: SchoolSummary
  isSelected: boolean
  badgeText?: string
  onClick: (schoolId: number) => void
}

function SchoolSummaryCard({ school, isSelected, badgeText, onClick }: Props) {
  return (
    <button
      type="button"
      className={isSelected ? `${styles.card} ${styles.selected}` : styles.card}
      onClick={() => onClick(school.id)}
    >
      <div className={styles.imageWrap}>
        {school.imageUrl ? (
          <img className={styles.image} src={school.imageUrl} alt={`${school.name} 대표 이미지`} />
        ) : (
          <div className={styles.fallback}>{school.name.slice(0, 1)}</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <strong>{school.name}</strong>
          {badgeText && <span className={styles.badge}>{badgeText}</span>}
        </div>
        <p className={styles.address}>{school.address}</p>
      </div>
    </button>
  )
}

export default SchoolSummaryCard
