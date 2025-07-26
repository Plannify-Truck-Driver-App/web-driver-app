import { updateEmailApi } from "api/user/update-informations/update-email.api";
import { MainButton } from "components/buttons";
import { TextInput } from "components/inputs";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { SyntheticEvent, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChangeEmailPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [newEmail, setNewEmail] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const isvalidEmail = (email: string): boolean => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    }

    const updateEmail = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!authentification) return

        if (newEmail === '') {
            toast.warning("Veuillez renseigner une adresse e-mail.")
            setErrorEmail(true)
            return
        }

        if (!isvalidEmail(newEmail)) {
            toast.warning("L'adresse e-mail n'est pas valide.")
            setErrorEmail(true)
            return
        }

        if (newEmail === authentification.payload.user.email) {
            toast.warning("L'adresse e-mail est identique à celle actuelle.")
            setErrorEmail(true)
            return
        }

        setLoading(true)
        const response = await updateEmailApi({ email: newEmail }, { navigation: navigate, authentification, setAuthentification })
        setLoading(false)

        if (response.success) {
            toast.success("Votre adresse e-mail a bien été modifiée.")
            setAuthentification(null);
            navigate('/connexion');
        }
    }

    useEffect(() => {
        setErrorEmail(false)
    }, [newEmail])

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Modifier mon e-mail" onClickReturn={() => navigate('/parametres/informations')} selectedSection={NavBarSection.PROFILE}>
            <div className="flex flex-col gap-6 text-base p-4 dark:text-white">
                <p className="text-left"><strong>Information</strong> : La modification de votre adresse e-mail entraînera une nouvelle demande de vérification de compte. Tant que vous n'aurez pas fait vérifié votre nouvelle adresse e-mail, nous ne pourrez plus accéder à votre espace Plannify.</p>
                <div className="text-left">
                    <p>Votre adresse e-mail actuelle</p>
                    <p className="text-slate-600 dark:text-slate-400">{ authentification.payload.user.email }</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-[90%]">
                        <TextInput type="email" label="Nouvelle e-mail" value={newEmail} placeholder="Nouvelle adresse e-mail" onChange={(e: any) => setNewEmail(e.target.value)} onEnterPress={(e) => updateEmail(e)} isError={errorEmail} />
                    </div>
                    <div>
                        <MainButton label="Changer l'e-mail" onClick={(e) => updateEmail(e)} isDisabled={!isvalidEmail(newEmail)} isLoading={loading} />
                    </div>
                </div>
            </div>
        </TemplateWorkday>
    )
}

export default ChangeEmailPage;