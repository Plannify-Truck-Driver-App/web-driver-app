import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'

import './assets/style/index.css'
import AuthenticationLayout from './layouts/authentication-layout'
import AuthenticationRoutes from './pages/authentication/authentication-routes'

createRoot(document.getElementById('root')!).render(
  <>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthenticationLayout />}>
            {AuthenticationRoutes()}
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
    <Toaster position="top-center" visibleToasts={5} expand={false} closeButton={true} toastOptions={{duration: 10000}}/>
  </>,
)
