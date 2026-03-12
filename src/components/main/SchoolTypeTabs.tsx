import styles from './styles/SchoolTypeTabs.module.css'
import { SCHOOL_TABS } from '../../constants/schools'
import { useMainPageStore } from '../../store/mainPageStore'

function SchoolTypeTabs() {
  const selectedType = useMainPageStore((state) => state.selectedType)
  const setSelectedType = useMainPageStore((state) => state.setSelectedType)

  return (
    <div className={styles.tabs}>
      {SCHOOL_TABS.map((tab) => {
        const isActive = tab.key === selectedType

        return (
          <button
            key={tab.key}
            type="button"
            className={isActive ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setSelectedType(tab.key)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default SchoolTypeTabs
