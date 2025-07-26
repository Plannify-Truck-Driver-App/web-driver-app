import { sendForgotPasswordMailApi } from "api/user/forgot-password.api";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { MainButton } from "components/buttons";
import { TextInput } from "components/inputs";
import { SyntheticEvent, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('')

    const [errorEmail, setErrorEmail] = useState<boolean>(false)

    const [canSendEmail, setCanSendEmail] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [mailSent, setMailSent] = useState<boolean>(false)

    const navigation: NavigateFunction = useNavigate()

    useEffect(() => {
        setErrorEmail(false)
        setCanSendEmail(calculCanSendEmail(email))
    }, [email])

    const calculCanSendEmail = (email: string): boolean => {
        return email !== ''
    }

    const sendEmailResetPasswordApi = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (email === '') {
            toast.warning("Veuillez renseigner votre adresse e-mail.")
            setErrorEmail(true)
            return
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            toast.warning("L'adresse e-mail n'est pas valide.")
            setErrorEmail(true)
            return
        }

        setLoading(true)
        const result = await sendForgotPasswordMailApi({ email }, { navigation, authentification: null, setAuthentification: null })
        setLoading(false)

        if (result.success) {
            setMailSent(true)
        }
    }

    return (
        <TemplateAuthentification title="Mot de passe oublié" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_forgot_password.svg" alt="Mot de passe oublié" /></div>, side: 'left' }} onClickReturn={() => navigation('/connexion')} >
            <div className="sm:flex sm:justify-center sm:items-center sm:h-full">
                <div>
                    {
                        mailSent ? (
                            <p>Un mail contenant un lien de réinitialisation a bien été envoyé à <span className="italic underline">{email}</span>.</p>
                        ) : (
                            <>
                                <p>Veuillez indiquer l'e-mail que vous avez renseigné lors de votre inscription.</p>
                                <div style={{ height: '30px' }}></div>
                                <form>
                                    <div style={{ width: '90%', display: 'inline-block' }} className="left">
                                        <TextInput type="email" label="E-mail" name="email" value={email} placeholder="Adresse e-mail" onChange={(e: any) => setEmail(e.target.value)} isError={errorEmail} onEnterPress={(e: any) => sendEmailResetPasswordApi(e)} />
                                    </div>
                                </form>
                                <div style={{ height: '20px' }}></div>
                                <MainButton label="Envoyer un mail" isDisabled={!canSendEmail} isLoading={loading} onClick={(e: SyntheticEvent) => sendEmailResetPasswordApi(e)} />
                            </>
                        )
                    }
                </div>
            </div>
        </TemplateAuthentification>
    )
}

export default ForgotPasswordPage;