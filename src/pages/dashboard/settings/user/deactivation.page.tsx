import { deactivateAccountApi } from "api/user/deactivate-account.api";
import { reactivateAccountApi } from "api/user/reactivate-account.api";
import { refreshTokenApi } from "api/user/refresh-token.api";
import { MainButton } from "components/buttons";
import { TextInput } from "components/inputs";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { TokenPayload } from "models";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import moment from "moment";
import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { tokenToPayload } from "utils/token-to-payload.util";

const UserDeactivationPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [deactivationInput, setDeactivationInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const onDeactivate = async () => {
        if (deactivationInput !== "Désactiver mon compte") {
            toast.warning("Veuillez saisir la phrase exacte pour désactiver votre compte.");
            return
        }

        if (authentification && authentification.payload.deactivation !== null) {
            toast.warning("Votre compte a déjà été désactivé.");
            return
        }

        setLoading(true);
        const response = await deactivateAccountApi(null, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success) {
            const token = await refreshTokenApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

            if (token && authentification && token.data) {
                const payload: TokenPayload = await tokenToPayload(token.data.accessToken);
                setAuthentification({ accessToken: token.data.accessToken, refreshToken: token.data.refreshToken, payload: payload })
                toast.success("Votre compte a été désactivé avec succès.");
                navigate('/dashboard/compte')
            } else {
                if (setAuthentification) setAuthentification(null)
                navigate('/connexion')
            }
        }

        setLoading(false);
    }

    const onReactivate = async () => {
        if (authentification && authentification.payload.deactivation === null) {
            toast.warning("Votre compte n'est pas en procédure de désactivation.");
            return
        }

        setLoading(true);
        const response = await reactivateAccountApi(null, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success) {
            const token = await refreshTokenApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

            if (token && authentification && token.data) {
                const payload: TokenPayload = await tokenToPayload(token.data.accessToken);
                setAuthentification({ accessToken: token.data.accessToken, refreshToken: token.data.refreshToken, payload: payload })
                toast.success("Votre compte a été réactivé avec succès.");
                navigate('/dashboard/compte')
            } else {
                if (setAuthentification) setAuthentification(null)
                navigate('/connexion')
            }
        }

        setLoading(false);
    }

    return (
        !authentification ? <></> :
        <TemplateWorkday title={authentification.payload.deactivation === null ? "Désactiver mon compte" : "Réactiver mon compte"} onClickReturn={() => navigate('/parametres/informations')} selectedSection={NavBarSection.PROFILE}>
            <div className="p-4 text-left dark:text-white">
                <div className="flex justify-center mb-8">
                    <div className="w-[80%] inline-block">
                        <img src="/images/undraw_deactivate.svg" alt="Désactivation d'un compte" />
                    </div>
                </div>
                {
                    authentification.payload.deactivation === null ? (
                        <>
                            <p>Vous êtes sur le point de désactiver votre compte Plannify. Toutes vos données seront supprimées après un délais de <b>30 jours</b>.</p>
                            <p>Cette procédure n'est pas définitive, vous pourrez l'annuler plus tard.</p>
                            <p className="mt-6">Saisissez <span className="text-[#FF0000]">Désactiver mon compte</span> dans le champ de saisie ci-dessous pour lancer la procédure de désactivation.</p>
                            <div className="flex justify-center my-4">
                                <div className="w-[80%]">
                                    <TextInput type="text" label="Clé de désactivation" value={deactivationInput} onChange={(e: any) => setDeactivationInput(e.target.value)} placeholder="Désactiver mon compte" isError={false} />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <MainButton label="Désactivation" isDisabled={deactivationInput !== "Désactiver mon compte"} isLoading={loading} onClick={() => onDeactivate()} colors={{ enabled: {border: "#C40000", background: "#FF0000", text: "#FFFFFF"}, disabled: {border: "#D88181", background: "#FF7B7B", text: "#FFFFFF"} }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Votre compte est en procédure de désactivation, toutes vos informations seront supprimées le <span className="text-[#FF0000]">{ moment(authentification.payload.deactivation).format('DD/MM/YYYY') }</span>.</p>
                            <p>Souhaitez-vous annuler cette procédure ?</p>
                            <div className="flex justify-center mt-4">
                                <MainButton label="Réactivation" isDisabled={false} isLoading={loading} onClick={() => onReactivate()} />
                            </div>
                        </>
                    )
                }
                <div className="h-40"></div>
            </div>
        </TemplateWorkday>
    )
}

export default UserDeactivationPage;