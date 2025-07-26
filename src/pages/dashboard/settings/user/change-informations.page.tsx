import { getUserInformationsApi } from "api/user/informations.api";
import { refreshTokenApi } from "api/user/refresh-token.api";
import { updateInformationsApi } from "api/user/update-informations/update-informations.api";
import { MainButton } from "components/buttons";
import { Selector, TextInput } from "components/inputs";
import { CenterPageLoader } from "components/loaders";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { TokenPayload } from "models";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { tokenToPayload } from "utils/token-to-payload.util";

const ChangeInformationPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [userInputs, setUserInputs] = useState<{ firstname: string, lastname: string, gender: string, phoneNumber: string }>({ firstname: authentification?.payload.user.firstname ?? '', lastname: authentification?.payload.user.lastname ?? '', gender: authentification?.payload.user.gender ?? '', phoneNumber: '' })
    const [errors, setErrors] = useState<{ firstname: boolean, lastname: boolean, gender: boolean, phoneNumber: boolean }>({ firstname: false, lastname: false, gender: false, phoneNumber: false})
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)

    const genders = [
        { label: 'Monsieur', value: 'M' },
        { label: 'Madame', value: 'Mme' },
        { label: 'Mademoiselle', value: 'Mlle' },
        { label: 'Aucun', value: '' }
    ]

    const getUserinformations = async () => {
        const response = await getUserInformationsApi(null, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success && response.data !== null) {
            setUserInputs(prev => ({ ...prev, phoneNumber: response.data!.phoneNumber ?? '' }))
        }
    }

    const onUpdateUserInformations = async () => {
        if (userInputs.firstname === '') {
            setErrors(prev => ({ ...prev, firstname: true }))
        }
        if (userInputs.lastname === '') {
            setErrors(prev => ({ ...prev, lastname: true }))
        }

        if (userInputs.firstname === '' || userInputs.lastname === '') {
            toast.warning('Veuillez renseigner les champs obligatoires.');
            return;
        }

        setLoadingUpdate(true)
        const response = await updateInformationsApi({ firstname: userInputs.firstname, lastname: userInputs.lastname, gender: userInputs.gender === '' ? null : userInputs.gender, phoneNumber: userInputs.phoneNumber === '' ? null : userInputs.phoneNumber }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoadingUpdate(false)

        if (response.success) {
            const token = await refreshTokenApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

            if (token && authentification && token.data) {
                const payload: TokenPayload = await tokenToPayload(token.data.accessToken);
                setAuthentification({ accessToken: token.data.accessToken, refreshToken: token.data.refreshToken, payload: payload })
                toast.success("Vos informations ont été mises à jour avec succès.")
            } else {
                if (setAuthentification) setAuthentification(null)
                navigate('/connexion')
            }
        }
    }

    useEffect(() => {
        if (authentification) {
            getUserinformations()
        }
    }, [])

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Modifier mes informations" onClickReturn={() => navigate('/parametres/informations')} selectedSection={NavBarSection.PROFILE}>
            <div className="text-left text-base px-2 my-6">
                <div className="flex flex-col gap-2 px-4 mb-4 dark:text-white">
                    <div>
                        <p>Prénom*</p>
                        <TextInput type='text' label={undefined} value={userInputs.firstname} placeholder="Votre prénom" onChange={(e: any) => setUserInputs(prev => ({...prev, firstname: e.target.value}))} isError={errors.firstname} onEnterPress={() => onUpdateUserInformations()} />
                    </div>
                    <div>
                        <p>Nom*</p>
                        <TextInput type='text' label={undefined} value={userInputs.lastname} placeholder="Votre nom" onChange={(e: any) => setUserInputs(prev => ({...prev, lastname: e.target.value}))} isError={errors.lastname} onEnterPress={() => onUpdateUserInformations()} />
                    </div>
                    <div>
                        <p>Genre*</p>
                        <Selector label={undefined} options={genders} isError={errors.gender} defaultValue={userInputs.gender} onChange={(value: string) => setUserInputs(prev => ({...prev, gender: value}))} />
                    </div>
                    <div>
                        <p>Téléphone</p>
                        <TextInput type='text' label={undefined} value={userInputs.phoneNumber} placeholder="Votre numéro de téléphone" onChange={(e: any) => setUserInputs(prev => ({...prev, phoneNumber: e.target.value}))} isError={errors.phoneNumber} onEnterPress={() => onUpdateUserInformations()} />
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    <MainButton label="Modifier les informations" onClick={() => onUpdateUserInformations()} isDisabled={userInputs.firstname === '' || userInputs.lastname === ''} isLoading={loadingUpdate} />
                </div>
            </div>
        </TemplateWorkday>
    )
}

export default ChangeInformationPage;