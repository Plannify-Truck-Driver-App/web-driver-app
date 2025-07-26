import { AuthProvider } from 'providers/authentification.provider';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './assets/styles/index.css';
import RequiereAuthentification from 'components/authentification/requiere-authentification.component';
import SuspensionPage from 'pages/authentification/suspension.page';
import ConnectionPage from 'pages/authentification/connection.page';
import InscriptionPage from 'pages/authentification/inscription.page';
import ForgotPasswordPage from 'pages/authentification/forgot-password.page';
import InscriptionLimitationPage from 'pages/authentification/inscription-limitation.page';
import LostPage from 'pages/utils/lost.page';
import VerificationPage from 'pages/authentification/verification.page';
import VerificationLinkPage from 'pages/link/verification-link.page';
import PasswordResetLinkPage from 'pages/link/password-reset-link.page';
import UnsubscribeNotificationListePage from 'pages/link/unsubscribe-notification-liste.page';
import AccountReactivationPage from 'pages/link/account-reactivation.page';
import { WorkdayProvider } from 'providers/workday.provider';
import WeekDashboardPage from 'pages/dashboard/week-dashboard.page';
import WorkdayDashboardPage from 'pages/dashboard/workday-dashboard.page';
import DocumentDashboardPage from 'pages/dashboard/document-dashboard.page';
import CompanyDashboardPage from 'pages/dashboard/company-dashboard.page';
import ProfileDashboardPage from 'pages/dashboard/profile-dashboard.page';
import { PrimeReactProvider } from 'primereact/api';
import SettingMailPage from 'pages/dashboard/settings/mails/setting-mail.page';
import PereferencesMailPage from 'pages/dashboard/settings/mails/preference-mail.page';
import UpdateWorkdayPage from 'pages/dashboard/workdays/update-workday.page';
import DeletedWorkdaysPage from 'pages/dashboard/workdays/deleted-workday.page';
import UpdatePage from 'pages/authentification/update.page';
import RestPeriodsPage from 'pages/dashboard/workdays/rest-periods.page';

import { createRoot } from 'react-dom/client';
import { DeactivationMailMonthlyReportPage } from 'pages/link/deactivation-mail-monthly-report.page';
import UserInformationsPage from 'pages/dashboard/settings/user/informations.page';
import ChangeEmailPage from 'pages/dashboard/settings/user/change-email.page';
import ChangePasswordPage from 'pages/dashboard/settings/user/change-password.page';
import ChangeInformationPage from 'pages/dashboard/settings/user/change-informations.page';
import UserDeactivationPage from 'pages/dashboard/settings/user/deactivation.page';
import AssistancePage from 'pages/dashboard/settings/assistance.page';
import { SystemProvider } from 'providers/system.provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <>
    <React.StrictMode>
      <Router>
        <PrimeReactProvider>
          <AuthProvider>
            <SystemProvider>
              <WorkdayProvider>
                <Routes>
                  <Route path='/' element={<Navigate to="/connexion" replace />} />
                  <Route path='/connexion' element={ <ConnectionPage /> } />
                  <Route path='/inscription' element={ <InscriptionPage /> } />
                  <Route path='/mot-de-passe-oublie' element={ <ForgotPasswordPage /> } />
                  <Route path='/verification' element={ <VerificationPage /> } />
                  <Route path='/suspension' element={ <SuspensionPage /> } />
                  <Route path='/limitation-inscription' element={ <InscriptionLimitationPage /> } />
                  <Route path='/mise-a-jour' element={ <UpdatePage /> } />

                  <Route path='/lien/verification-compte' element={ <VerificationLinkPage /> } />
                  <Route path='/lien/mot-de-passe-oublie' element={ <PasswordResetLinkPage /> } />
                  <Route path='/lien/desinscription-liste-notification' element={ <UnsubscribeNotificationListePage /> } />
                  <Route path='/lien/reactivation-compte' element={ <AccountReactivationPage /> } />
                  <Route path='/lien/desactivation-preference-mail/rapport-mensuel' element={ <DeactivationMailMonthlyReportPage /> } />

                  <Route element={ <RequiereAuthentification /> }>
                    <Route path='/dashboard/semaine' element={ <WeekDashboardPage /> } />
                    <Route path='/dashboard/coupures' element={ <RestPeriodsPage /> } />
                    <Route path='/dashboard/journees' element={ <WorkdayDashboardPage /> } />
                    <Route path='/dashboard/modifier-journee/:dateWorkday' element={ <UpdateWorkdayPage /> } />
                    <Route path='/dashboard/journees/supprimees' element={ <DeletedWorkdaysPage /> } />
                    <Route path='/dashboard/documents' element={ <DocumentDashboardPage /> } />
                    <Route path='/dashboard/entreprise' element={ <CompanyDashboardPage /> } />
                    <Route path='/dashboard/compte' element={ <ProfileDashboardPage /> } />
                    <Route path='/parametres/informations' element={ <UserInformationsPage /> } />
                    <Route path='/parametres/modifier/informations' element={ <ChangeInformationPage /> } />
                    <Route path='/parametres/modifier/email' element={ <ChangeEmailPage /> } />
                    <Route path='/parametres/modifier/mot-de-passe' element={ <ChangePasswordPage /> } />
                    <Route path='/parametres/desactivation-compte' element={ <UserDeactivationPage /> } />
                    <Route path='/parametres/mails' element={ <SettingMailPage /> } />
                    <Route path='/parametres/mails/preferences' element={ <PereferencesMailPage /> } />
                    <Route path='/parametres/assistance' element={ <AssistancePage /> } />
                  </Route>

                  <Route path='*' element={ <LostPage /> } />
                </Routes>
              </WorkdayProvider>
            </SystemProvider>
          </AuthProvider>
        </PrimeReactProvider>
      </Router>
    </React.StrictMode>
    <Toaster position="top-center" visibleToasts={5} expand={false} closeButton={true} toastOptions={{duration: 10000}} richColors/>
  </>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
});