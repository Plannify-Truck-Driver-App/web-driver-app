import { MainButton, SecondaryButton } from "components/buttons";
import { SyntheticEvent, useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthentification from "hooks/useAuthentification.hook";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { connectionApi } from "api/user/connection.api";
import { TextInput } from "components/inputs";
import { TokenPayload } from "models/payload-token.model";
import { tokenToPayload } from "utils/token-to-payload.util";
import { refreshTokenApi } from "api/user/refresh-token.api";
import { CenterPageLoader } from "components/loaders";

const ConnectionPage: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [errorEmail, setErrorEmail] = useState<boolean>(false)
    const [errorPassword, setErrorPassword] = useState<boolean>(false)

    const [canConnect, setCanConnect] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [autoRefreshToken, setAutoRefreshToken] = useState<boolean>(false)

    const navigation: NavigateFunction = useNavigate()
    const localisation: Location = useLocation()
    const from = localisation.state?.from.pathname || '/dashboard/semaine'

    const { authentification, setAuthentification } = useAuthentification()

    useEffect(() => {
        if (authentification) {
            refreshTokenIfLogged()
        }
    }, [authentification])

    useEffect(() => {
        setErrorEmail(false)
        setErrorPassword(false)
        setCanConnect(calculCanConnect(email, password))
    }, [email, password])

    const refreshTokenIfLogged = async () => {
        setAutoRefreshToken(true)
        const token = await refreshTokenApi({ navigation: navigation, authentification: authentification, setAuthentification: setAuthentification })

        if (token && authentification && token.data) {
            const payload: TokenPayload = await tokenToPayload(token.data.accessToken);
            setAuthentification({ accessToken: token.data.accessToken, refreshToken: token.data.refreshToken, payload: payload })

            navigation(from, { replace: true })
        } else {
            if (setAuthentification) {
                setAuthentification(null)
            }
        }
        setAutoRefreshToken(false)
    }

    const connection = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (email === '') {
            toast.warning("Veuillez renseigner votre adresse e-mail.")
            setErrorEmail(true)
            return
        }

        if (password === '') {
            toast.warning("Veuillez renseigner votre mot de passe.")
            setErrorPassword(true)
            return
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            toast.warning("L'adresse e-mail n'est pas valide.")
            setErrorEmail(true)
            return
        }

        setLoading(true)
        const response = await connectionApi({ email, password }, { navigation, authentification, setAuthentification })
        setLoading(false)

        if (response.success && response.data) {
            const payload: TokenPayload = await tokenToPayload(response.data.accessToken)
            
            setAuthentification({...response.data, payload: payload})
            navigation(from, { replace: true })
        }
    }

    const calculCanConnect = (email: string, password: string): boolean => {
        return email !== '' && password !== ''
    }

    return (
        <TemplateAuthentification title="Connexion" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_connected_world.svg" alt="Un monde connecté" /></div>, side: 'left' }}>
            {
                autoRefreshToken ? <CenterPageLoader content="Connexion en cours..." /> : (
                    <>
                        <form>
                            <div className="inline-block w-[90%]">
                                <TextInput type="email" label="E-mail" name="email" value={email} placeholder="Adresse e-mail" onChange={(e: any) => setEmail(e.target.value)} isError={errorEmail} onEnterPress={(e: any) => connection(e)} />
                                <div style={{ height: '8px' }}></div>
                                <TextInput type="password" label="Mot de passe" name="password" value={password} placeholder="Mot de passe" onChange={(e: any) => setPassword(e.target.value)} isError={errorPassword} onEnterPress={(e: any) => connection(e)} />
                                <div style={{ height: '4px' }}></div>
                                <div className="text-left">
                                    <p style={{ fontSize: '16px', margin: '0 10px', padding: 0 }} className="cursor-pointer" onClick={(e: SyntheticEvent) => navigation("/mot-de-passe-oublie")} >Mot de passe oublié ?</p>
                                </div>
                            </div>
                        </form>
                        <div style={{ height: '20px' }}></div>
                        <MainButton label="Connectez-vous" isDisabled={!canConnect} isLoading={loading} onClick={(e: any) => connection(e)} />
                        <hr className="border-0 border-b border-[#DADADA] my-[20px]" />
                        <SecondaryButton label="Inscrivez-vous" isDisabled={false} isLoading={false} onClick={() => navigation("/inscription")} />
                    </>
                )
            }
        </TemplateAuthentification>
    )
}

export default ConnectionPage;