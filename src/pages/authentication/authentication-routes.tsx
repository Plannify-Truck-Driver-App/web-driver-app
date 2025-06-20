import { Route } from 'react-router-dom'
import LoginPageFeature from './feature/login-page-feature'
import RegisterPageFeature from './feature/register-page-feature'

export default function AuthenticationRoutes() {
    return (
        <>
            <Route path="/login" element={<LoginPageFeature />} />
            <Route path="/register" element={<RegisterPageFeature />} />
        </>
    )
}