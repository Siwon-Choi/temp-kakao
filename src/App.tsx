// import { Navigate, Route, Routes } from 'react-router-dom'
// import './App.css'
// import LoginPage from './pages/LoginPage'
// import { DEFAULT_SCHOOL_PATH } from './constants/schools'
// import ProtectedRoute from './components/routes/ProtectedRoute'
// import PublicOnlyRoute from './components/routes/PublicOnlyRoute'
// import AuthLayout from './components/layouts/AuthLayout'
// import ServiceLayout from './components/layouts/ServiceLayout'
// import MainPage from './pages/MainPage'
// import ProfilePage from './pages/ProfilePage'

// function App() {
//   return (
//     <Routes>
//       <Route element={<PublicOnlyRoute />}>
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<LoginPage />} />
//         </Route>
//       </Route>

//       <Route element={<ProtectedRoute />}>
//         <Route element={<ServiceLayout />}>
//           <Route path={DEFAULT_SCHOOL_PATH} element={<MainPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//         </Route>
//       </Route>

//       <Route path="*" element={<Navigate to={DEFAULT_SCHOOL_PATH} replace />} />
//     </Routes>
//   )
// }

// export default App


import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import { DEFAULT_SCHOOL_PATH } from './constants/schools'
import ProtectedRoute from './components/routes/ProtectedRoute'
import PublicOnlyRoute from './components/routes/PublicOnlyRoute'
import AuthLayout from './components/layouts/AuthLayout'
import ServiceLayout from './components/layouts/ServiceLayout'
import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage'
import ProfileRegisterPage from './pages/ProfileRegisterPage'
import RegistrationRoute from './components/routes/RegistrationRoute'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/profile/register" element={<ProfileRegisterPage />} />

        <Route element={<RegistrationRoute />}>
          <Route element={<ServiceLayout />}>
            <Route path={DEFAULT_SCHOOL_PATH} element={<MainPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={DEFAULT_SCHOOL_PATH} replace />} />
    </Routes>
  )
}

export default App
