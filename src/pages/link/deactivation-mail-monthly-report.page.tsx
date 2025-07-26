import { deactivateMailPreferenceByTokenApi } from "api/user/token/deactivate-mail-preference.api";
import { statusDeactivateMailPreferenceApi } from "api/user/token/status-deactivate-mail-preference.api";
import { MainButton } from "components/buttons";
import { CenterPageLoader } from "components/loaders";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";

export const DeactivationMailMonthlyReportPage: React.FC = () => {
    const location: Location = useLocation();

    const navigate: NavigateFunction = useNavigate();

    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const tokenParam: string | null = urlParams.get('token');

    const [loadingCheckState, setLoadingCheckState] = useState<boolean>(false);
    const [loadingDeactivate, setLoadingDeactivate] = useState<boolean>(false);

    const [mailPreferenceStatus, setMailPreferenceStatus] = useState<{ isActive: boolean, isEditable: boolean } | null>(null);
    const [deactivationState, setDeactivationState] = useState<boolean>(false);

    useEffect(() => {
        if (tokenParam !== null)
            checkTokenStateDeactivationMailPreference(tokenParam);
    }, [tokenParam])

    const checkTokenStateDeactivationMailPreference = async (token: string) => {
        setLoadingCheckState(true);
        const result = await statusDeactivateMailPreferenceApi({ token: token, typeMailId: 4 }, { navigation: navigate, authentification: null, setAuthentification: null })
        setLoadingCheckState(false);

        if (result.success) {
            setMailPreferenceStatus(result.data);
        }
    }

    const deactivate = async (token: string) => {
        setLoadingDeactivate(true);
        const result = await deactivateMailPreferenceByTokenApi({ token: token, typeMailId: 4 }, { navigation: navigate, authentification: null, setAuthentification: null })
        setLoadingDeactivate(false);

        if (result.success) {
            setDeactivationState(true);
        }
    }
    
    return (
        tokenParam === null ? (
            <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }}>
                <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                    <div className="text-center">
                        <div className="sm:hidden">
                            <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                            <div style={{ height: '20px' }}></div>
                        </div>
                        <p>Oups il semblerait que votre lien n'est pas complet. Il n'est donc pas possible de vous désinscrire dans ce contexte.</p>
                        <p>Veuillez vous rapprocher du service qui vous a envoyé ce lien.</p>
                        <div style={{ height: '30px' }}></div>
                        <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                    </div>
                </div>
            </TemplateAuthentification>
        ) : (
            loadingCheckState ? (
                <CenterPageLoader content="Vérification de votre préférence aux mails mensuels en cours..." />
            ) : (
                mailPreferenceStatus === null ? (
                    <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_a_day_off.svg" alt="Un peu de repos" /></div>, side: 'left' }}>
                        <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                            <div className="text-center">
                                <div className="sm:hidden">
                                <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                    <div style={{ height: '20px' }}></div>
                                </div>
                                <p className="text-left">Une erreur est survenue auprès du serveur.</p>
                                <p className="text-left">Veuillez vous rapprocher du service qui vous a envoyé ce lien.</p>
                                <div style={{ height: '30px' }}></div>
                                <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                            </div>
                        </div>
                    </TemplateAuthentification>
                ) : (
                    !mailPreferenceStatus.isActive ? (
                        <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_a_day_off.svg" alt="Un peu de repos" /></div>, side: 'left' }}>
                            <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                <div className="text-center">
                                    <div className="sm:hidden">
                                        <img src="/images/undraw_a_day_off.svg" alt="Des personnes dans la nature" className="inline-block w-[60%]" />
                                        <div style={{ height: '20px' }}></div>
                                    </div>
                                    <p className="text-left">Vous êtes actuellement dispensé des mails mensuels. Si vous souhaitez vous inscrire à ce service, veuillez l'activer depuis votre espace.</p>
                                    <div style={{ height: '30px' }}></div>
                                    <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                                </div>
                            </div>
                        </TemplateAuthentification>
                    ) : (
                        !mailPreferenceStatus.isEditable ? (
                            <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_a_day_off.svg" alt="Un peu de repos" /></div>, side: 'left' }}>
                                <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                    <div className="text-center">
                                        <div className="sm:hidden">
                                            <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                            <div style={{ height: '20px' }}></div>
                                        </div>
                                        <p className="text-left">Les rapports mensuels ne peuvent actuellement pas être désactivé.</p>
                                        <p className="text-left">Veuillez vous rapprocher du service qui vous a envoyé ce lien.</p>
                                        <div style={{ height: '30px' }}></div>
                                        <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                                    </div>
                                </div>
                            </TemplateAuthentification>
                        ) : (
                            !deactivationState ? (
                                <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_my_files.svg" alt="Une personne manipulant des fichiers" /></div>, side: 'left' }}>
                                    <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                        <div className="text-center">
                                            <div className="sm:hidden">
                                                <img src="/images/undraw_my_files.svg" alt="Une personne manipulant des fichiers" className="inline-block w-[60%]" />
                                                <div style={{ height: '20px' }}></div>
                                            </div>
                                            <p className="text-left">Vous êtes actuellement abonné aux mails mensuels et vous recevez donc mensuellement votre rapport sur les journées que vous avez effectués le mois précédant.</p>
                                            <div style={{ height: '10px' }}></div>
                                            <p className="text-left">Souhaitez-vous poursuivre la procédure de désinscription à ce service ?</p>
                                            <div style={{ height: '20px' }}></div>
                                            <MainButton label="Poursuivre la procédure" isDisabled={tokenParam === null} isLoading={loadingDeactivate} onClick={() => deactivate(tokenParam)} />
                                        </div>
                                    </div>
                                </TemplateAuthentification>
                            ) : (
                                <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_a_day_off.svg" alt="Un peu de repos" /></div>, side: 'left' }}>
                                    <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                        <div className="text-center">
                                            <div className="sm:hidden">
                                                <img src="/images/undraw_a_day_off.svg" alt="Des personnes dans la nature" className="inline-block w-[60%]" />
                                                <div style={{ height: '20px' }}></div>
                                            </div>
                                            <p className="text-left">Votre demande a bien été prise en compte ! Si vous souhaitez vous inscrire à nouveau à ce service, vous devrez l'activer depuis votre espace.</p>
                                            <div style={{ height: '30px' }}></div>
                                            <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                                        </div>
                                    </div>
                                </TemplateAuthentification>
                            )
                        )
                    )
                )
            )
        )
    )
}