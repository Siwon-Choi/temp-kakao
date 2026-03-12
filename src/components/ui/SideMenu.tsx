import { NavLink } from 'react-router-dom'
import style from '../styles/SideMenu.module.css'
import { SCHOOL_TABS } from '../../constants/schools'

function SideMenu() {
  return (
    <aside className={style.sideMenu}>
      {SCHOOL_TABS.map((tab) => (
        <NavLink
          key={tab.key}
          to={`/schools/${tab.key}`}
          className={({ isActive }) =>
            `${style.menuItem} ${isActive ? style.active : ''}`.trim()
          }
        >
          <span className={style.menuText}>{tab.label}</span>
        </NavLink>
      ))}

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${style.menuItem} ${isActive ? style.active : ''}`.trim()
        }
      >
        <span className={style.menuText}>내 프로필</span>
      </NavLink>
    </aside>
  )
}

export default SideMenu
