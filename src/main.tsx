import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
// import AuthenticationRoutes from './pages/authentication/authentication-routes'

import './assets/style/index.css'
import AuthenticationLayout from './layouts/authentication-layout'
import AuthenticationRoutes from './pages/authentication/authentication-routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthenticationLayout />}>
          {AuthenticationRoutes()}
        </Route>
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
