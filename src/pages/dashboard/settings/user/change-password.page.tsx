import { updatePasswordApi } from "api/user/update-informations/update-password.api";
import PasswordPropertiesCheck from "components/authentification/password-properties.component";
import { MainButton } from "components/buttons";
import { TextInput } from "components/inputs";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { IPasswordProperties } from "pages/link/password-reset-link.page";
import { SyntheticEvent, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChangePasswordPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [passwordInputs, setPasswordInputs] = useState<{ oldPassword: string, newPassword: string, verifyNewPassword: string }>({ oldPassword: '', newPassword: '', verifyNewPassword: '' })
    const [errorPassword, setErrorPassword] = useState<{ oldPassword: boolean, newPassword: boolean, verifyNewPassword: boolean }>({ oldPassword: false, newPassword: false, verifyNewPassword: false });
    const [passwordProperties, setPasswordProperties] = useState<IPasswordProperties>({ length: false, uppercase: false, lowercase: false, number: false, special: false })
    const [loading, setLoading] = useState<boolean>(false);

    const rulesRespected: boolean = passwordProperties.length && passwordProperties.uppercase && passwordProperties.lowercase && passwordProperties.number && passwordProperties.special

    const [isUpdated, setIsUpdated] = useState<boolean>(false);

    const updatePassword = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (passwordInputs.oldPassword.trim() === '') {
            toast.warning("Veuillez renseigner votre mot de passe actuel.")
            setErrorPassword(prev => ({...prev, oldPassword: true}))
            return
        }

        if (passwordInputs.newPassword.trim() === '') {
            toast.warning("Veuillez renseigner un nouveau mot de passe.")
            setErrorPassword(prev => ({...prev, newPassword: true}))
            return
        }
        if (passwordInputs.verifyNewPassword.trim() === '') {
            toast.warning("Veuillez confirmer votre nouveau mot de passe.")
            setErrorPassword(prev => ({...prev, verifyNewPassword: true}))
            return
        }

        if (!rulesRespected) {
            toast.warning("Le nouveau mot de passe ne respecte pas les règles de sécurité.")
            setErrorPassword(prev => ({...prev, newPassword: true}))
            return
        }

        if (passwordInputs.newPassword.trim() !== passwordInputs.verifyNewPassword.trim()) {
            toast.warning("Les mots de passe ne correspondent pas.")
            setErrorPassword(prev => ({...prev, newPassword: true, verifyNewPassword: true}))
            return
        }

        setLoading(true)
        const response = await updatePasswordApi({ oldPassword: passwordInputs.oldPassword, newPassword: passwordInputs.newPassword }, { navigation: navigate, authentification, setAuthentification })
        setLoading(false)

        if (response.success) {
            setIsUpdated(true);
        }
    }

    const updatePasswordProprieties = (password1: string) => {
        const length: boolean = password1.trim().length >= 10
        const uppercase: boolean = /[A-Z]/.test(password1.trim())
        const lowercase: boolean = /[a-z]/.test(password1.trim())
        const number: boolean = /[0-9]/.test(password1.trim())
        const special: boolean = /[^a-zA-Z0-9]/.test(password1.trim())

        setPasswordProperties({ length, uppercase, lowercase, number, special })
    }

    useEffect(() => {
        setErrorPassword({ oldPassword: false, newPassword: false, verifyNewPassword: false })
        updatePasswordProprieties(passwordInputs.newPassword)
    }, [passwordInputs.oldPassword, passwordInputs.newPassword, passwordInputs.verifyNewPassword])

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Modifier mon mot de passe" onClickReturn={() => navigate('/parametres/informations')} selectedSection={NavBarSection.PROFILE}>
            {
                isUpdated ? (
                    <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2">
                        <p className="text-center">Votre mot de passe a bien été modifié !</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 mt-4 dark:text-white">
                        <div className="w-[90%]">
                            <TextInput type="password" label="Mot de passe actuel" value={passwordInputs.oldPassword} placeholder="Votre mot de passe actuel" onChange={(e: any) => setPasswordInputs(prev => ({...prev, oldPassword: e.target.value}))} onEnterPress={(e) => updatePassword(e)} isError={errorPassword.oldPassword} />
                        </div>
                        <div className="w-[90%]">
                            <TextInput type="password" label="Nouveau mot de passe" value={passwordInputs.newPassword} placeholder="Un nouveau mot de passe" onChange={(e: any) => setPasswordInputs(prev => ({...prev, newPassword: e.target.value}))} onEnterPress={(e) => updatePassword(e)} isError={errorPassword.newPassword} />
                        </div>
                        <div className="w-[90%]">
                            <TextInput type="password" label="Nouveau mot de passe*" value={passwordInputs.verifyNewPassword} placeholder="Vérifiez le nouveau mot de passe" onChange={(e: any) => setPasswordInputs(prev => ({...prev, verifyNewPassword: e.target.value}))} onEnterPress={(e) => updatePassword(e)} isError={errorPassword.verifyNewPassword} />
                        </div>
                        <div>
                            <PasswordPropertiesCheck passwordProperties={passwordProperties} samePassword={passwordInputs.newPassword.trim() === passwordInputs.verifyNewPassword.trim() && passwordInputs.newPassword.trim() !== ''} />
                        </div>
                        <div>
                            <MainButton label="Changer le mot de passe" onClick={(e) => updatePassword(e)} isDisabled={!rulesRespected || passwordInputs.oldPassword.trim() === '' || passwordInputs.newPassword !== passwordInputs.verifyNewPassword} isLoading={loading} />
                        </div>
                    </div>
                )
            }
        </TemplateWorkday>
    )
}

export default ChangePasswordPage;