import { Outlet } from 'react-router-dom'
import PageFooter from '../ui/PageFooter'

function AuthLayout() {
  return (
    <div className="appShell">
      <div className="appMainLogin">
        <Outlet />
      </div>
      <PageFooter />
    </div>
  )
}

export default AuthLayout
