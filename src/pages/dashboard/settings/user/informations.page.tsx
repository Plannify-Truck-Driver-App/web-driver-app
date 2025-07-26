import { getUserInformationsApi } from "api/user/informations.api";
import FlatInformation from "components/informations/flat-information.component";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { ClipboardPenLine, KeyRound, Mail, UserCog } from "lucide-react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import moment from "moment";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

const UserInformationsPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [userInformations, setUserInformations] = useState<{ userId: string, firstname: string, lastname: string, gender: string | null, email: string, phoneNumber: string | null, isSearchable: boolean, allowProfessionalRequest: boolean, language: string, createdAt: Date, verifiedAt: Date | null, deactivateAt: Date | null } | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const getUserinformations = async () => {
        setLoading(true)
        const response = await getUserInformationsApi(null, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false)

        if (response.success && response.data !== null) {
            setUserInformations(response.data)
        }
    }

    useEffect(() => {
        if (authentification) {
            getUserinformations()
        }
    }, [])

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Mes informations" onClickReturn={() => navigate('/dashboard/compte')} selectedSection={NavBarSection.PROFILE}>
            <div className="text-left text-base px-2 dark:text-white">
                <div className="flex flex-col gap-2 px-4 mb-4">
                    <div>
                        <p>Identifiant</p>
                        <p className="text-slate-600 dark:text-slate-400">{ authentification.payload.user.userId }</p>
                    </div>
                    <div>
                        <p>Appellation</p>
                        <p className="text-slate-600 dark:text-slate-400">{ authentification.payload.user.gender ? authentification.payload.user.gender + '. ' : '' }{ authentification.payload.user.firstname } { authentification.payload.user.lastname }</p>
                    </div>
                    <div>
                        <p>E-mail</p>
                        <p className="text-slate-600 dark:text-slate-400">{ authentification.payload.user.email }</p>
                    </div>
                    <div>
                        <p>Numéro de téléphone</p>
                        <p className="text-slate-600 dark:text-slate-400">{ loading ? "Chargement..." : userInformations?.phoneNumber ?? 'Aucun numéro' }</p>
                    </div>
                    {/* <div>
                        <p>Visibilité pour les entreprises</p>
                        <div>
                            {
                                userInformations.isSearchable ? (
                                    <p className="inline-block text-green-700 border border-green-700 bg-green-100 rounded-lg py-1 px-2">Visible</p>
                                ) : (
                                    <p className="inline-block text-red-700 border border-red-700 bg-red-100 rounded-lg py-1 px-2">Masqué</p>
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <p>Autorise les demandes d'accords professionnelles</p>
                        <div>
                            {
                                userInformations.allowProfessionalRequest ? (
                                    <p className="inline-block text-green-700 border border-green-700 bg-green-100 rounded-lg py-1 px-2">Autorise</p>
                                ) : (
                                    <p className="inline-block text-red-700 border border-red-700 bg-red-100 rounded-lg py-1 px-2">Refuse</p>
                                )
                            }
                        </div>
                    </div> */}
                    <div>
                        <p>Date de création</p>
                        <p className="text-slate-600 dark:text-slate-400">{ loading ? "Chargement..." : moment(userInformations?.createdAt).format('DD/MM/YYYY HH:mm:ss') }</p>
                    </div>
                    {
                        authentification.payload.deactivation && (
                            <div>
                                <p className="text-[#FF0000]">Date de désactivation prévue</p>
                                <p className="text-slate-600 dark:text-slate-400">{ moment(authentification.payload.deactivation).format('DD/MM/YYYY') }</p>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col items-center gap-6 py-4">
                    <FlatInformation onClick={() => navigate('/parametres/modifier/informations')}>
                        <div className="w-full flex flex-row items-center gap-2">
                            <div className="p-2">
                                <ClipboardPenLine />
                            </div>
                            <p>Modifier mes informations</p>
                        </div>
                    </FlatInformation>
                    <FlatInformation onClick={() => navigate('/parametres/modifier/email')}>
                        <div className="w-full flex flex-row items-center gap-2">
                            <div className="p-2">
                                <Mail />
                            </div>
                            <p>Modifier mon e-mail</p>
                        </div>
                    </FlatInformation>
                    <FlatInformation onClick={() => navigate('/parametres/modifier/mot-de-passe')}>
                        <div className="w-full flex flex-row items-center gap-2">
                            <div className="p-2">
                                <KeyRound />
                            </div>
                            <p>Modifier mon mot de passe</p>
                        </div>
                    </FlatInformation>
                    {
                        userInformations?.deactivateAt ? (
                            <FlatInformation borderColor={"#DADADA"} onClick={() => navigate('/parametres/desactivation-compte')}>
                                <div className="w-full flex flex-row items-center gap-2">
                                    <div className="p-2">
                                        <UserCog color="#27AE60" />
                                    </div>
                                    <p className="text-[#27AE60]">Réactiver mon compte</p>
                                </div>
                            </FlatInformation>
                        ) : (
                            <FlatInformation borderColor={"#FF0000"} onClick={() => navigate('/parametres/desactivation-compte')}>
                                <div className="w-full flex flex-row items-center gap-2">
                                    <div className="p-2">
                                        <UserCog color="#FF0000" />
                                    </div>
                                    <p className="text-[#FF0000]">Désactiver mon compte</p>
                                </div>
                            </FlatInformation>
                        )
                    }
                </div>
                <div className="h-40"></div>
            </div>
        </TemplateWorkday>
    )
}

export default UserInformationsPage;