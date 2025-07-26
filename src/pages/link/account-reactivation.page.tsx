import { accountReactivationApi } from "api/user/token/account-reactivation.api";
import TemplateAuthentification from "components/templates/template-authentification.component"
import { MainButton } from "components/buttons";
import { useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validityTokenApi } from "api/user/token/validity-token.api";
import { CenterPageLoader } from "components/loaders";

const AccountReactivationPage: React.FC = () => {
    const location: Location = useLocation();

    const navigate: NavigateFunction = useNavigate();

    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const tokenParam: string | null = urlParams.get('token');

    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [reactivationState, setReactivationState] = useState<boolean>(false);

    useEffect(() => {
        verifyToken(tokenParam ?? '');
    }, [])

    const verifyToken = async (token: string) => {
        if (!token) {
            toast.warning("Le token de réactivation est manquant.");
            return;
        }

        const result = await validityTokenApi({ token: token, type: "#P03" }, { navigation: navigate, authentification: null, setAuthentification: null })

        setIsTokenValid(result.success);
    }

    const reactivation = async () => {
        if (!tokenParam) {
            toast.warning("Le token de réactivation est manquant.");
            return;
        }

        setLoading(true);
        const result = await accountReactivationApi({ token: tokenParam }, { navigation: navigate, authentification: null, setAuthentification: null })
        setLoading(false);

        if (result.success) {
            setReactivationState(result.data ?? false);
        }
    }

    return (
        isTokenValid === null ? (
            <CenterPageLoader content="Vérification de la validité de votre token" />
        ) : (
            !isTokenValid ? (
                <TemplateAuthentification title="Réactivation de compte" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }} >
                    <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                        <div className="text-center">
                            <div className="sm:hidden">
                                <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                <div style={{ height: '20px' }}></div>
                            </div>
                            <p>Oups il semblerait que votre lien ne soit plus valide. Il n'est donc pas possible de réactiver votre compte dans ce contexte.</p>
                            <div style={{ height: '30px' }}></div>
                            <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                        </div>
                    </div>
                </TemplateAuthentification>
            ) : (
                tokenParam === null ? (
                    <TemplateAuthentification title="Réactivation de compte" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }} >
                        <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                            <div className="text-center">
                                <div className="sm:hidden">
                                    <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                    <div style={{ height: '20px' }}></div>
                                </div>
                                <p>Oups il semblerait que votre lien n'est pas complet. Il n'est donc pas possible de réactiver votre compte dans ce contexte.</p>
                                <p>Veuillez vous rapprocher du service qui vous a envoyé ce lien.</p>
                                <div style={{ height: '30px' }}></div>
                                <p className="text-slate-600 dark:text-slate-400">Vous pouvez fermer cette page.</p>
                            </div>
                        </div>
                    </TemplateAuthentification>
                ) : (
                    reactivationState ? (
                        <TemplateAuthentification title="Réactivation de compte" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_happy.svg" alt="Des personnes heureuses" /></div>, side: 'left' }}>
                            <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                <div className="text-center">
                                    <div className="sm:hidden">
                                        <img src="/images/undraw_happy.svg" alt="Des personnes heureuses" className="inline-block w-[60%]" />
                                        <div style={{ height: '20px' }}></div>
                                    </div>
                                    <p>Votre compte a bien été réactivé !</p>
                                    <div style={{ height: '30px' }}></div>
                                    <MainButton label="Connectez-vous" isDisabled={false} isLoading={false} onClick={() => navigate('/connexion')} />
                                </div>
                            </div>
                        </TemplateAuthentification>
                    ) : (
                        <TemplateAuthentification title="Réactivation de compte" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_account.svg" alt="Un compte" /></div>, side: 'left' }}>
                            <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                                <div className="text-center">
                                    <div className="sm:hidden">
                                        <img src="/images/undraw_account.svg" alt="Le compte d'une personne" className="inline-block w-[60%]" />
                                        <div style={{ height: '20px' }}></div>
                                    </div>
                                    <p className="text-left">Souhaitez-vous réactiver votre compte ?</p>
                                    <div style={{ height: '30px' }}></div>
                                    <MainButton label="Réactiver mon compte" isDisabled={tokenParam === null} isLoading={loading} onClick={() => reactivation()} />
                                </div>
                            </div>
                        </TemplateAuthentification>
                    )
                )
            )
        )
    )
}

export default AccountReactivationPage