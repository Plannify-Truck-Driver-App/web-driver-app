import { sendVerificationMailApi } from "api/user/send-verification-mail.api";
import { updateVerificationEmailApi } from "api/user/update-verification-email.api";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { MainButton, SecondaryButton } from "components/buttons";
import { TextInput } from "components/inputs";
import { LightUser } from "models";
import { SyntheticEvent, useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerificationPage: React.FC = () => {
    const location: Location = useLocation();
    const etatLocation: any = location.state;
    const [user, setUser] = useState<LightUser | null>(null)

    const [emailUpdate, setEmailUpdate] = useState<boolean>(false)

    const navigation: NavigateFunction = useNavigate()

    useEffect(() => {
        if (!etatLocation) {
            navigation("/connexion")
        } else {
            setUser(etatLocation.user)
        }
    }, [etatLocation, navigation])

    return (
        !user ? <p>Vous n'êtes pas autorisés à accéder à cette page.</p> : (
            emailUpdate ? <EmailUpdate user={user} updateUser={setUser} navigation={navigation} changePage={() => setEmailUpdate(false)} /> :
            <VerificationInformations user={user} navigation={navigation} changePage={() => setEmailUpdate(true)}  />
        )
    )
}

interface VerificationInformationsProps {
    user: LightUser,
    navigation: NavigateFunction,
    changePage: () => void
}

const VerificationInformations: React.FC<VerificationInformationsProps> = ({ user, navigation, changePage }) => {
    const [loading, setLoading] = useState<boolean>(false)

    const sendVerificationMail = async (e: SyntheticEvent) => {
        e.preventDefault()

        setLoading(true)
        const response = await sendVerificationMailApi({ email: user.email }, { navigation: navigation, authentification: null, setAuthentification: null })
        setLoading(false)

        if (response.success) {
            toast.success("Un nouveau mail de vérification vous a été envoyé.")
        }
    }

    return (
        <TemplateAuthentification title="Vérification" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_mail_received.svg" alt="Mail envoyé" /></div>, side: 'right' }} onClickReturn={() => navigation('/connexion')} >
            <div className="text-center sm:hidden">
                <img src="/images/undraw_mail_received.svg" alt="Mail envoyé" className="inline-block w-[60%]" />
                <div style={{ height: '10px' }}></div>
            </div>
            <p className="text-left">
                Un mail vous a été envoyé à l’adresse :<br />
                <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
            </p>
            <div style={{ height: '40px' }}></div>
            <MainButton label="Renvoyer un mail" isDisabled={false} isLoading={loading} onClick={(e: SyntheticEvent) => sendVerificationMail(e)} />
            <div style={{ height: '30px' }}></div>
            <SecondaryButton label="Changer l'e-mail" isDisabled={false} isLoading={false} onClick={() => changePage()} />
        </TemplateAuthentification>
    )
}

interface EmailUpdateProps {
    user: LightUser,
    updateUser: (user: LightUser) => void,
    navigation: NavigateFunction,
    changePage: () => void
}

const EmailUpdate: React.FC<EmailUpdateProps> = ({ user, updateUser, navigation, changePage }) => {
    const [email, setEmail] = useState<string>(user.email)
    const [errorEmail, setErrorEmail] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const updateEmail = async (e: SyntheticEvent) => {
        e.preventDefault()

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            toast.warning("L'adresse e-mail n'est pas valide.")
            setErrorEmail(true)
            return
        }

        if (email === user.email) {
            toast.warning("L'adresse e-mail saisie est la même que l'ancienne.")
            setErrorEmail(true)
            return 
        }

        setLoading(true)
        const response = await updateVerificationEmailApi({ oldEMail: user.email, newEmail: email }, { navigation: navigation, authentification: null, setAuthentification: null })
        setLoading(false)

        if (response.success) {
            toast.success("L'adresse e-mail a bien été modifiée.")
            updateUser({ ...user, email: email })
            changePage()
        }
    }

    useEffect(() => {
        setErrorEmail(false)
    }, [email])

    return (
        <TemplateAuthentification title="Vérification" secondElementLargeDiv={null} onClickReturn={() => changePage()}>
            <div className="flex justify-center">
                <div className="sm:w-[60%]">
                    <div className="h-[20px] sm:h-0"></div>
                    <p className="text-left">Les erreurs ça arrive à tout le monde, pas de panique ! Vous pouvez changer l'adresse e-mail ci-dessous :</p>
                    <div style={{ height: '20px' }}></div>
                    <div>
                        <TextInput type="email" label="E-mail" value={ email } placeholder="Votre bonne adresse e-mail" isError={errorEmail} onChange={(e: any) => setEmail(e.target.value)} onEnterPress={(e: any) => updateEmail(e)} />
                    </div>
                    <div style={{ height: '30px' }}></div>
                    <MainButton label="Modifier l'adresse e-mail" isDisabled={email === ''} isLoading={loading} onClick={(e: SyntheticEvent) => updateEmail(e)} />
                </div>
            </div>
        </TemplateAuthentification>
    )
}

export default VerificationPage