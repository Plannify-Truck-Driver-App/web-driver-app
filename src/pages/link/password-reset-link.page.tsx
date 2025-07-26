import { updatePasswordFromTokenApi } from "api/user/token/update-password-from-token.api";
import { validityTokenApi } from "api/user/token/validity-token.api";
import PasswordPropertiesCheck from "components/authentification/password-properties.component";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { MainButton, SecondaryButton } from "components/buttons";
import { TextInput } from "components/inputs";
import { CenterPageLoader } from "components/loaders";
import { SyntheticEvent, useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PasswordResetLinkPage: React.FC = () => {
    const location: Location = useLocation();

    const navigate: NavigateFunction = useNavigate();

    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const tokenParam: string | null = urlParams.get('token');

    const [loading, setLoading] = useState<boolean>(true);
    const [allowPasswordUpdate, setAllowPasswordUpdate] = useState<boolean>(false);

    
    useEffect(() => {
        if (tokenParam !== null)
            tokenValidityVerification(tokenParam);
        // eslint-disable-next-line
    }, [tokenParam]);

    const tokenValidityVerification = async (token: string) => {
        setLoading(true);
        const response = await validityTokenApi({ token: token, type: "#P02" }, { navigation: navigate, authentification: null, setAuthentification: null })
        setLoading(false);

        if (response.success) {
            setAllowPasswordUpdate(response.data ?? false)
        }
    }

    return (
        tokenParam === null ? (
            <TemplateAuthentification title="Réinitialisation du mot de passe" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }} >
                <div className="text-center sm:flex sm:justify-center sm:items-center sm:h-full">
                    <div className="text-center">
                        <div className="sm:hidden">
                            <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                            <div style={{ height: '10px' }}></div>
                        </div>
                        <p>Oups il semblerait que votre lien n'est pas complet. Il est donc <strong>impossible</strong> de faire vérifier votre compte dans ces conditions...</p>
                        <div style={{ height: '20px' }}></div>
                        <SecondaryButton label="Annuler" isDisabled={false} isLoading={false} onClick={() => navigate('/connexion')} />
                    </div>
                </div>
            </TemplateAuthentification>
        ) : (
            loading ? (
                <CenterPageLoader content="Vérification de la validité de l'url en cours..." />
            ) : (
                allowPasswordUpdate ? (
                    <UpdatePasswordForm token={tokenParam} navigate={navigate} />
                ) : (
                    <TemplateAuthentification title="Réinitialisation du mot de passe" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_error.svg" alt="Une erreur" /></div>, side: 'left' }} >
                        <div className="text-center sm:flex sm:justify-center sm:items-center sm:h-full">
                            <div className="text-center">
                                <div className="sm:hidden">
                                    <img src="/images/undraw_error.svg" alt="Une erreur" className="inline-block w-[60%]" />
                                    <div style={{ height: '10px' }}></div>
                                </div>
                                <p>Oups ce lien de réinitialisation de mot de passe n'est plus valide...</p>
                                <div style={{ height: '20px' }}></div>
                                <SecondaryButton label="Annuler" isDisabled={false} isLoading={false} onClick={() => navigate('/connexion')} />
                            </div>
                        </div>
                    </TemplateAuthentification>
                )
            )
        )
    )
}

interface IUpdatePasswordFormProps {
    token: string;
    navigate: NavigateFunction;
}

export interface IPasswordProperties {
    length: boolean,
    uppercase: boolean,
    lowercase: boolean,
    number: boolean,
    special: boolean
}

const UpdatePasswordForm: React.FC<IUpdatePasswordFormProps> = ({ token, navigate }) => {
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')

    const [passwordProperties, setPasswordProperties] = useState<IPasswordProperties>({ length: false, uppercase: false, lowercase: false, number: false, special: false })
    const [samePassword, setSamePassword] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [errorPassword1, setErrorPassword1] = useState<boolean>(false)
    const [errorPassword2, setErrorPassword2] = useState<boolean>(false)

    const [canUpdate, setCanUpdate] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect(() => {
        updatePasswordProprieties(password1)
        isSamePassword(password1, password2)

        setErrorPassword1(false)
        setErrorPassword2(false)
    }, [password1, password2])

    const updatePasswordProprieties = (password1: string) => {
        const length: boolean = password1.length >= 10
        const uppercase: boolean = /[A-Z]/.test(password1)
        const lowercase: boolean = /[a-z]/.test(password1)
        const number: boolean = /[0-9]/.test(password1)
        const special: boolean = /[^a-zA-Z0-9]/.test(password1)

        setPasswordProperties({ length, uppercase, lowercase, number, special })
        setCanUpdate(length && uppercase && lowercase && number && special)
    }

    const isSamePassword = (password1: string, password2: string) => {
        setSamePassword(password1 === password2 && password1 !== '')
    }

    const updatePassword = async (e: SyntheticEvent) => {
        e.preventDefault()

        if (password1 === '') {
            toast.warning("Veuillez renseigner votre mot de passe.")
            setErrorPassword1(true)
            return
        }

        if (password2 === '') {
            toast.warning("Veuillez renseigner votre mot de passe.")
            setErrorPassword2(true)
            return
        }

        if (!canUpdate) {
            toast.warning("Veuillez respecter les critères de mot de passe.")
            setErrorPassword1(true)
            return
        }

        if (!samePassword) {
            toast.warning("Les mots de passe ne sont pas identiques.")
            setErrorPassword2(true)
            return
        }

        setLoading(true)
        const response = await updatePasswordFromTokenApi({ token: token, password: password1 }, { navigation: navigate, authentification: null, setAuthentification: null } )
        setLoading(false)

        if (response.success) {
            setIsSuccess(response.data ?? false)
        }
    }

    return (
        !isSuccess ? (
            <TemplateAuthentification title="Réinitialisation du mot de passe" secondElementLargeDiv={{ content: <div className="text-left"><PasswordPropertiesCheck passwordProperties={passwordProperties} samePassword={samePassword} /></div>, side: 'left' }}>
                <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                    <div>
                        <form>
                            <div style={{ width: '90%', display: 'inline-block' }}>
                                <TextInput type="password" label="Mot de passe" name="password" value={password1} placeholder="Mot de passe" onChange={(e: any) => setPassword1(e.target.value)} isError={errorPassword1} onEnterPress={(e: any) => updatePassword(e)} />
                                <div style={{ height: '8px' }}></div>
                                <TextInput type="password" label="Mot de passe*" name="password" value={password2} placeholder="Vérifiez le mot de passe" onChange={(e: any) => setPassword2(e.target.value)} isError={errorPassword2} onEnterPress={(e: any) => updatePassword(e)} />
                            </div>
                        </form>
                        <div className="sm:hidden">
                            <div style={{ height: '10px' }}></div>
                            <PasswordPropertiesCheck passwordProperties={passwordProperties} samePassword={samePassword} />
                        </div>
                        <div style={{ height: '20px' }}></div>
                        <MainButton label="Réinitialiser le mot de passe" isDisabled={!canUpdate} isLoading={loading} onClick={(e: SyntheticEvent) => updatePassword(e)} />
                    </div>
                </div>
            </TemplateAuthentification>
        ) : (
            <TemplateAuthentification title="Réinitialisation du mot de passe" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_happy.svg" alt="Des personnes heureuses" /></div>, side: 'left' }}>
                <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                    <div>
                        <div className="text-center">
                            <div className="sm:hidden">
                                <img src="/images/undraw_happy.svg" alt="Des personnes heureuses" className="inline-block w-[60%]" />
                                <div style={{ height: '10px' }}></div>
                            </div>
                            <p>Votre mot de passe a bien été modifié !</p>
                            <div style={{ height: '20px' }}></div>
                            <MainButton label="Me connecter" isDisabled={false} isLoading={false} onClick={() => navigate('/connexion')} />
                        </div>
                    </div>
                </div>
            </TemplateAuthentification>
        )
    )
}

export default PasswordResetLinkPage;