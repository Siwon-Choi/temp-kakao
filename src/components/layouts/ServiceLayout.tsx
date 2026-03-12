import { Outlet } from 'react-router-dom'
import GlobalHeader from './GlobalHeader'
import styles from './styles/ServiceLayout.module.css'

function ServiceLayout() {
  return (
    <div className={styles.shell}>
      <GlobalHeader />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export default ServiceLayout
