import { subscribeNotificationListApi } from "api/user/registration/subscribe-notification-list.api"
import TemplateAuthentification from "components/templates/template-authentification.component"
import { MainButton } from "components/buttons"
import { TextInput } from "components/inputs"
import moment from "moment"
import { SyntheticEvent, useEffect, useState } from "react"
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const InscriptionLimitationPage: React.FC = () => {
    const navigation: NavigateFunction = useNavigate()
    const location: Location = useLocation();
    const locationState: any = location.state;
    const [endDate, setEndDate] = useState<Date | null>(null)

    const [email, setEmail] = useState<string>('')
    const [canSendEmail, setCanSendEmail] = useState<boolean>(false)
    const [subscriptionState, setSubscriptionState] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [errorEmail, setErrorEmail] = useState<boolean>(false)

    useEffect(() => {
        if (!locationState) {
            navigation("/connexion")
        } else {
            setEndDate(locationState.endDate)
        }
    }, [locationState, navigation])

    useEffect(() => {
        setCanSendEmail(email !== '')
        setErrorEmail(false)
    }, [email])

    const sendEmail = async (e: SyntheticEvent) => {
        e.preventDefault()

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
        const request = await subscribeNotificationListApi({ email: email }, { navigation: navigation, authentification: null, setAuthentification: null })
        setLoading(false)

        setSubscriptionState(request.success)
    }

    return (
        <TemplateAuthentification title="Inscription" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_server_cluster.svg" alt="Limitation d'inscription" /></div>, side: 'right' }} onClickReturn={() => navigation('/connexion')}>
            {
                subscriptionState ? <></> : (
                    <>
                        <div className="sm:hidden w-full flex justify-center py-4">
                            <div className="w-[80%]">
                                <img src="/images/undraw_server_cluster.svg" alt="Limitation d'inscription" />
                            </div>
                        </div>
                        <div className="text-left">
                            <p>
                                Plannify rencontre actuellement un grand nombre de solicitation, nous avons donc limité le nombre d’inscriptions pour garantir une qualité de service optimale.<br /><br />
                                { endDate ? <>La réouverture est prévue pour le <strong>{ moment(endDate).format("DD/MM/YYYY à HH:mm") }</strong>.</> : "Vous pouvez saisir votre adresse e-mail afin d’être averti lorsque de nouveaux accès seront disponible !" }
                            </p>
                        </div>
                        <div style={{ height: '20px' }}></div>
                    </>
                )
            }
            
            {
                endDate ? <></> : (
                    subscriptionState ? <>
                        <p>Votre adresse e-mail a bien été enregistrée, vous serez averti lorsque de nouveaux accès seront disponible !</p>
                        <span className="italic underline">{email}</span>
                    </> : <>
                        <form>
                            <div className="inline-block w-[90%]">
                                <TextInput type="email" label="E-mail" value={email} placeholder="Adresse e-mail" onChange={(e: any) => setEmail(e.target.value)} isError={errorEmail} onEnterPress={(e: SyntheticEvent) => sendEmail(e)} />
                            </div>
                        </form>
                        <div style={{ height: '20px' }}></div>
                        <MainButton label="Prévenez-moi" isDisabled={!canSendEmail} isLoading={loading} onClick={(e: SyntheticEvent) => sendEmail(e)} />
                        <div className="sm:hidden h-40"></div>
                    </>
                )
            }
        </TemplateAuthentification>
    )
}

export default InscriptionLimitationPage