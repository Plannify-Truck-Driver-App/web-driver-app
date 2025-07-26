import { registrationStatusApi } from "api/user/registration/registration-status.api";
import PasswordPropertiesCheck, { IPasswordPropertiesProps } from "components/authentification/password-properties.component";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { MainButton } from "components/buttons";
import { Selector, TextInput } from "components/inputs";
import CenterPageLoader from "components/loaders/center-page-loader.component";
import { LightUser } from "models";
import { SyntheticEvent, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registrationApi } from "api/user/registration.api";

const InscriptionPage: React.FC = () => {
    const [p1Data, setP1Data] = useState<IInscriptionP1Data | null>(null)
    const [allowInscription, setAllowInscription] = useState<boolean>(false)
    const navigation: NavigateFunction = useNavigate()

    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        if (p1Data !== null)
            setPage(2)
    }, [p1Data])

    useEffect(() => {
        getInscriptionState()
    })

    const getInscriptionState = async () => {
        const inscriptionState = await registrationStatusApi({ navigation, authentification: null, setAuthentification: null })

        console.log(inscriptionState)

        if (!inscriptionState.success)
            navigation('/connexion')
        else if (inscriptionState.data.data !== null)
            navigation('/limitation-inscription', { state: { endDate: inscriptionState.data.data.end_at !== null ? new Date(inscriptionState.data.data.end_at) : null } })
        else
            setAllowInscription(true)
    }

    return (
        allowInscription ? <>
            {
                page === 1 || p1Data === null ?
                <InscriptionP1 navigation={navigation} p1Data={p1Data} setP1Data={setP1Data} /> :
                <InscriptionP2 navigation={navigation} p1Data={p1Data} setPage={setPage} />
            }
        </> : <CenterPageLoader content="Vérification de l'état d'inscription auprès du serveur." />
    )
}

interface IInscriptionP1Props {
    navigation: NavigateFunction,
    p1Data: IInscriptionP1Data | null,
    setP1Data: (data: IInscriptionP1Data) => void
}

interface IInscriptionP1Data {
    firstname: string,
    lastname: string,
    gender: string,
    email: string
}

const InscriptionP1: React.FC<IInscriptionP1Props> = ({ navigation, p1Data, setP1Data }) => {
    const [firstname, setFirstname] = useState<string>(p1Data?.firstname || '')
    const [lastname, setLastname] = useState<string>(p1Data?.lastname || '')
    const [gender, setGender] = useState<string>(p1Data?.gender || 'M')
    const [email, setEmail] = useState<string>(p1Data?.email || '')

    const [errorFirstname, setErrorFirstname] = useState<boolean>(false)
    const [errorLastname, setErrorLastname] = useState<boolean>(false)
    const [errorEmail, setErrorEmail] = useState<boolean>(false)

    const [canSignup, setCanSignup] = useState<boolean>(false)

    useEffect(() => {
        setErrorFirstname(false)
        setErrorLastname(false)
        setErrorEmail(false)
        setCanSignup(calculCanSignup(firstname, lastname, email))
    }, [firstname, lastname, email])

    const nextPage = async (e: SyntheticEvent) => {
        e.preventDefault()

        if (firstname === '') {
            toast.warning("Veuillez saisir un prénom.")
            setErrorFirstname(true)
            return
        }

        if (lastname === '') {
            toast.warning("Veuillez saisir un nom.")
            setErrorLastname(true)
            return
        }

        if (email === '') {
            toast.warning("Veuillez saisir une adresse e-mail.")
            setErrorEmail(true)
            return
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            toast.warning("L'adresse e-mail n'est pas valide.")
            setErrorEmail(true)
            return
        }

        setP1Data({ firstname, lastname, gender, email })
    }

    const calculCanSignup = (firstname: string, lastname: string, email: string): boolean => {
        return firstname !== '' && lastname !== '' && email !== ''
    }

    const genders = [
        { label: 'Monsieur', value: 'M' },
        { label: 'Madame', value: 'Mme' },
        { label: 'Mademoiselle', value: 'Mlle' },
        { label: 'Aucun', value: '' }
    ]

    return (
        <TemplateAuthentification title="Inscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_signup.svg" alt="Inscription" /></div>, side: 'right' }} onClickReturn={() => navigation('/connexion')}>
            <form>
                <div className="inline-block w-[90%]">
                    <TextInput type="text" label="Prénom" name="firstname" value={firstname} placeholder="Prénom" onChange={(e: any) => setFirstname(e.target.value)} isError={errorFirstname} onEnterPress={(e: any) => nextPage(e)} />
                    <div style={{ height: '8px' }}></div>
                    <TextInput type="text" label="Nom" name="lastname" value={lastname} placeholder="Nom" onChange={(e: any) => setLastname(e.target.value)} isError={errorLastname} onEnterPress={(e: any) => nextPage(e)} />
                    <div style={{ height: '8px' }}></div>
                    <Selector label="Genre" options={genders} isError={false} defaultValue={gender} onChange={(valeur: string) => setGender(valeur)} fullWidth={true} />
                    <div style={{ height: '8px' }}></div>
                    <TextInput type="email" label="E-mail" name="email" value={email} placeholder="Adresse e-mail" onChange={(e: any) => setEmail(e.target.value)} isError={errorEmail} onEnterPress={(e: any) => nextPage(e)} />
                </div>
            </form>
            <div style={{ height: '40px' }}></div>
            <MainButton label="Etape suivante" isDisabled={!canSignup} isLoading={false} onClick={(e: SyntheticEvent) => nextPage(e)} />
        </TemplateAuthentification>
    )
}

interface IInscriptionP2Props {
    navigation: NavigateFunction,
    p1Data: IInscriptionP1Data,
    setPage: (page: number) => void
}

const InscriptionP2: React.FC<IInscriptionP2Props> = ({ navigation, p1Data, setPage }) => {
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')

    const [passwordProperties, setPasswordProperties] = useState<IPasswordPropertiesProps>({ length: false, uppercase: false, lowercase: false, number: false, special: false })
    const [samePassword, setSamePassword] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [errorPassword1, setErrorPassword1] = useState<boolean>(false)
    const [errorPassword2, setErrorPassword2] = useState<boolean>(false)

    const [canSignup, setCanSignup] = useState<boolean>(false)

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
        setCanSignup(length && uppercase && lowercase && number && special)
    }

    const isSamePassword = (password1: string, password2: string) => {
        setSamePassword(password1 === password2 && password1 !== '')
    }

    const inscription = async (e: SyntheticEvent) => {
        e.preventDefault()

        if (password1 === '') {
            toast.warning("Veuillez renseigner un mot de passe.")
            setErrorPassword1(true)
            return
        }

        if (password2 === '') {
            toast.warning("Veuillez vérifier le mot de passe.")
            setErrorPassword2(true)
            return
        }

        if (!canSignup) {
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
        const response = await registrationApi({ firstname: p1Data.firstname, lastname: p1Data.lastname, gender: p1Data.gender, email: p1Data.email, password: password1 }, { navigation, authentification: null, setAuthentification: null } )
        setLoading(false)

        if (response.success) {
            toast.success("Inscription réussie.")
            navigation("/verification", { state: { user: LightUser.fromJSON(response.data) }})
        }
    }

    return (
        <TemplateAuthentification title="Inscription" secondElementLargeDiv={{ content: <div className="text-left"><PasswordPropertiesCheck passwordProperties={passwordProperties} samePassword={samePassword} /></div>, side: 'left' }} onClickReturn={() => setPage(1)}>
            <form>
                <div style={{ width: '90%', display: 'inline-block' }}>
                    <TextInput type="password" label="Mot de passe" name="password" value={password1} placeholder="Mot de passe" onChange={(e: any) => setPassword1(e.target.value)} isError={errorPassword1} onEnterPress={(e: any) => inscription(e)} />
                    <div style={{ height: '8px' }}></div>
                    <TextInput type="password" label="Mot de passe*" name="password" value={password2} placeholder="Vérifiez le mot de passe" onChange={(e: any) => setPassword2(e.target.value)} isError={errorPassword2} onEnterPress={(e: any) => inscription(e)} />
                </div>
            </form>
            <div className="sm:hidden">
                <div style={{ height: '10px' }}></div>
                <PasswordPropertiesCheck passwordProperties={passwordProperties} samePassword={samePassword} />
            </div>
            <div style={{ height: '20px' }}></div>
            <MainButton label="Inscrivez-vous" isDisabled={!canSignup} isLoading={loading} onClick={(e: SyntheticEvent) => inscription(e)} />
        </TemplateAuthentification>
    )
}

export default InscriptionPage;