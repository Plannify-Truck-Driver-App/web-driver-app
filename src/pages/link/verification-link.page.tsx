import { verificationAccountApi } from "api/user/token/verification-account.api";
import TemplateAuthentification from "components/templates/template-authentification.component"
import { MainButton, SecondaryButton } from "components/buttons";
import { CenterPageLoader } from "components/loaders";
import useAuthentification from "hooks/useAuthentification.hook";
import { TokenPayload } from "models/payload-token.model";
import React, { useEffect, useState } from "react"
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { tokenToPayload } from "utils/token-to-payload.util";

const VerificationLinkPage: React.FC = () => {
    const location: Location = useLocation();
    const { authentification, setAuthentification } = useAuthentification()

    const navigate: NavigateFunction = useNavigate();

    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const tokenParam: string | null = urlParams.get('token');

    const [loading, setLoading] = useState<boolean>(true);
    const [verificationState, setVerificationState] = useState<boolean>(false);

    useEffect(() => {
        if (tokenParam !== null)
            accountVerification(tokenParam);
    }, [tokenParam]);

    const accountVerification = async (token: string) => {
        setLoading(true);
        const response = await verificationAccountApi({ token: token }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false);

        if (response.success) {
            if (response && response.data) {
                const payload: TokenPayload = await tokenToPayload(response.data.accessToken)
                setAuthentification({...response.data, payload: payload})
            }
                
            setVerificationState(true)
        }
    }

    return (
        tokenParam === null ? (
            <TemplateAuthentification title="Vérification" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }} >
                <div className="text-center sm:flex sm:justify-center sm:items-center sm:h-full">
                    <div>
                        <div className="sm:hidden">
                            <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                            <div style={{ height: '20px' }}></div>
                        </div>
                        <p>Oups il semblerait que votre lien n'est pas complet. Il est donc <strong>impossible</strong> de faire vérifier votre compte dans ces conditions...</p>
                        <div style={{ height: '30px' }}></div>
                        <SecondaryButton label="Annuler" isDisabled={false} isLoading={false} onClick={() => navigate('/connexion')} />
                    </div>
                </div>
            </TemplateAuthentification>
        ) : (
            loading ? (
                <CenterPageLoader content="Vérification de votre compte en cours..." />
            ) : (
                verificationState ? (
                    <TemplateAuthentification title="Vérification" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_happy.svg" alt="Des personnes heureuses" /></div>, side: 'left' }} >
                        <div className="text-center sm:flex sm:justify-center sm:items-center sm:h-full">
                            <div>
                                <div className="sm:hidden">
                                    <img src="/images/undraw_happy.svg" alt="Des personnes heureuses" className="inline-block w-[60%]" />
                                    <div style={{ height: '20px' }}></div>
                                </div>
                                <p>Votre compte a bien été vérifié !</p>
                                <div style={{ height: '30px' }}></div>
                                <MainButton label="Accéder à l'application" isDisabled={false} isLoading={false} onClick={() => navigate('/dashboard/semaine')} />
                            </div>
                        </div>
                    </TemplateAuthentification>
                ) : (
                    <TemplateAuthentification title="Vérification" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }} >
                        <div className="text-center sm:flex sm:justify-center sm:items-center sm:h-full">
                            <div>
                                <div className="sm:hidden">
                                    <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                    <div style={{ height: '20px' }}></div>
                                </div>
                                <p>Oups la vérification de votre compte n'a pas pu aboutir...</p>
                                <div style={{ height: '30px' }}></div>
                                <SecondaryButton label="Annuler" isDisabled={false} isLoading={false} onClick={() => navigate('/connexion')} />
                            </div>
                        </div>
                    </TemplateAuthentification>
                )
            )
        )
    )
}

export default VerificationLinkPage