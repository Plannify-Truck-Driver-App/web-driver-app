import { Route } from 'react-router-dom'
import LoginPageFeature from './feature/login-page-feature'

export default function AuthenticationRoutes() {
    return (
        <>
            <Route path="/login" element={<LoginPageFeature />} />
        </>
    )
}