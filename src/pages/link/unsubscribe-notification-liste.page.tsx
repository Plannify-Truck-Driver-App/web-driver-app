import { checkOnNotificationListApi } from "api/user/registration/check-on-notification-list.api";
import { unsubscribeNotificationListApi } from "api/user/registration/unsubscribe-notification-list.api";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { MainButton } from "components/buttons";
import { CenterPageLoader } from "components/loaders";
import { useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";

const UnsubscribeNotificationListePage: React.FC = () => {
    const location: Location = useLocation();

    const navigate: NavigateFunction = useNavigate();

    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const emailParam: string | null = urlParams.get('email');

    const [loadingNotificationList, setLoadingNotificationList] = useState<boolean>(false);
    const [loadingUnsubscribe, setLoadingUnsubscribe] = useState<boolean>(false);
    const [isOnNotificationList, setIsOnNotificationList] = useState<boolean>(false);
    const [unsubscribeState, setUnsubscribeState] = useState<boolean>(false);

    useEffect(() => {
        if (emailParam !== null)
            checkNotificationList(emailParam);
    }, [emailParam])

    const checkNotificationList = async (email: string) => {
        setLoadingNotificationList(true);
        const result = await checkOnNotificationListApi({ email: email }, { navigation: navigate, authentification: null, setAuthentification: null })
        setLoadingNotificationList(false);

        if (result.success) {
            setIsOnNotificationList(result.data ?? false);
        }
    }

    const unsubscribe = async () => {
        setLoadingUnsubscribe(true);
        const result = await unsubscribeNotificationListApi({ email: emailParam! }, { navigation: navigate, authentification: null, setAuthentification: null })
        setLoadingUnsubscribe(false);

        if (result.success) {
            setUnsubscribeState(true);
        }
    }

    return (
        emailParam === null ? (
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
            loadingNotificationList ? (
                <CenterPageLoader content="Vérification de votre inscription sur notre liste de notification en cours..." />
            ) : (
                unsubscribeState ? (
                    <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_a_day_off.svg" alt="Un peu de repos" /></div>, side: 'left' }}>
                        <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                            <div className="text-center">
                                <div className="sm:hidden">
                                    <img src="/images/undraw_a_day_off.svg" alt="Des personnes dans la nature" className="inline-block w-[60%]" />
                                    <div style={{ height: '20px' }}></div>
                                </div>
                                <p className="text-left">Votre adresse e-mail a bien été retirée de notre liste de notification !</p>
                                <p className="text-left">Cette opération n'empêchera pas une future inscription à notre application.</p>
                                <div style={{ height: '30px' }}></div>
                                <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                            </div>
                        </div>
                    </TemplateAuthentification>
                ) : (
                    isOnNotificationList ? (
                        <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_notification_list.svg" alt="Liste de notification" /></div>, side: 'left' }}>
                            <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                <div className="text-center">
                                    <div className="sm:hidden">
                                        <img src="/images/undraw_notification_list.svg" alt="Une personne manipulant une liste" className="inline-block w-[60%]" />
                                        <div style={{ height: '20px' }}></div>
                                    </div>
                                    <p className="text-left">Suite à une limitation du nombre d'inscription sur notre application, vous avez demandé à être notifié par mail de la réouverture du service d'inscription.</p>
                                    <div style={{ height: '10px' }}></div>
                                    <p className="text-left">Souhaitez-vous poursuivre la procédure de désinscription de notre liste de notification ?</p>
                                    <div style={{ height: '20px' }}></div>
                                    <MainButton label="Poursuivre la procédure" isDisabled={emailParam === null} isLoading={loadingUnsubscribe} onClick={() => unsubscribe()} />
                                </div>
                            </div>
                        </TemplateAuthentification>
                    ) : (
                        <TemplateAuthentification title="Désinscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }}>
                            <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                <div className="text-center">
                                    <div className="sm:hidden">
                                        <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                        <div style={{ height: '20px' }}></div>
                                    </div>
                                    <p className="text-left">Oups vous n'êtes pas sur notre liste de notification...</p>
                                    <div style={{ height: '10px' }}></div>
                                    <p className="text-left">Vous avez envie de rejoindre l'aventure ?</p>
                                    <div style={{ height: '20px' }}></div>
                                    <MainButton label="Inscrivez-vous" isDisabled={false} isLoading={false} onClick={() => navigate('/inscription')} />
                                </div>
                            </div>
                        </TemplateAuthentification>
                    )
                )
            )
        )
    );
}

export default UnsubscribeNotificationListePage;