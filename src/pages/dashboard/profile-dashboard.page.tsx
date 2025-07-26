import { MainButton } from "components/buttons";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { Maintenance, Suspension } from "models";
import moment from "moment";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import FlatInformation from "components/informations/flat-information.component";
import { BookUser, Construction, LifeBuoy, Mail } from "lucide-react";
import useSystem from "hooks/useSystem.hook";

const ProfileDashboardPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const { systemContext } = useSystem();
    const navigate: NavigateFunction = useNavigate();

    const deconnexion = () => {
        if (authentification) {
            setAuthentification(null)
            navigate('/connexion')
        }
    }

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Mon compte" selectedSection={NavBarSection.PROFILE}>
            <div className="text-left py-4 px-6 dark:text-white">
                <p className="p-0 m-0">
                    {
                        authentification.payload.user.gender ? (
                            authentification.payload.user.gender + ". " + authentification.payload.user.firstname + " " + authentification.payload.user.lastname.toUpperCase()
                        ) : (
                            authentification.payload.user.firstname + " " + authentification.payload.user.lastname.toUpperCase()
                        )
                    }
                </p>
                <p className="text-slate-600 dark:text-slate-400 p-0 m-0">{ authentification.payload.user.email }</p>
            </div>
            {/* <p>Votre token expire à { moment(new Date(authentification.payload.exp * 1000)).format("HH:mm:ss") } mais sa mise-à-jour se fera à { moment(new Date((authentification.payload.exp * 1000) - 1000 * 10)).format("HH:mm:ss") } !</p> */}
            {
                authentification.payload.suspension ? <SuspensionInformation suspension={authentification.payload.suspension.data} navigate={navigate} /> : <></>
            }
            {
                authentification.payload.deactivation ? <DesactivationInformation desactivationDate={authentification.payload.deactivation} /> : <></>
            }
            <div className="w-full flex flex-col items-center gap-6 my-4">
                <FlatInformation onClick={() => navigate('/parametres/informations')}>
                    <div className="w-full flex flex-row items-center gap-2">
                        <div className="p-2">
                            <BookUser />
                        </div>
                        <p>Mes informations</p>
                    </div>
                </FlatInformation>
                <FlatInformation onClick={() => navigate('/parametres/mails')}>
                    <div className="w-full flex flex-row items-center gap-2">
                        <div className="p-2">
                            <Mail />
                        </div>
                        <p>Gérer les mails</p>
                    </div>
                </FlatInformation>
                <FlatInformation onClick={() => navigate('/parametres/assistance')}>
                    <div className="w-full flex flex-row items-center gap-2">
                        <div className="p-2">
                            <LifeBuoy />
                        </div>
                        <p>Besoin d'assistance ?</p>
                    </div>
                </FlatInformation>
            </div>
            {
                systemContext.maintenances.data.length > 0 ? (
                    <>
                        <div className="h-4"></div>
                        <div className="px-6 flex flex-row items-center gap-2 dark:text-white">
                            <Construction />
                            <p>{systemContext.maintenances.data.length > 1 ? "Maintenances prévues" : "Maintenance prévue"}</p>
                        </div>
                        {
                            systemContext.maintenances.data.map((maintenance: Maintenance, index: number) => (
                                <MaintenanceInformation maintenance={maintenance} key={index} />
                            ))
                        }
                    </>
                ) : (
                    <></>
                )
            }
            <div className="h-10"></div>
            <div className="flex justify-center">
                <MainButton label="Déconnexion" onClick={deconnexion} isDisabled={false} isLoading={false} />
            </div>
            <div className="h-10"></div>
            <div>
                <p className="dark:text-white">Version { process.env.REACT_APP_VERSION }</p>
            </div>
            <div className="h-40"></div>
        </TemplateWorkday>
    )
}

const SuspensionInformation: React.FC<{ suspension: Suspension, navigate: NavigateFunction }> = ({ suspension, navigate }) => {

    return (
        <div className="flex justify-center text-base my-6">
            <div className="w-[90%] bg-white dark:bg-[#141f30] dark:text-white rounded-lg border border-[#FF0000] text-left py-1 px-2">
                <p className="text-[#FF0000]">Suspension</p>
                <div className="h-[10px]"></div>
                <p>Votre compte est en procédure de suspension avec un accès restreint.</p>
                <div className="h-[10px]"></div>
                <p className="underline" onClick={() => navigate('/suspension', { state: { suspension: suspension } })}>Plus d'informations</p>
            </div>
        </div>
    )
}

const DesactivationInformation: React.FC<{ desactivationDate: string }> = ({ desactivationDate }) => {

    return (
        <div className="flex justify-center text-base my-6">
            <div className="w-[90%] bg-white dark:bg-[#141f30] dark:text-white rounded-lg border border-[#FF0000] text-left py-1 px-2">
                <p className="text-[#FF0000]">Désactivation</p>
                <div className="h-[10px]"></div>
                <p>Votre compte est en procédure de désactivation. Toutes vos données seront automatiquement supprimées dès que la date de désactivation sera atteinte.</p>
                <div className="h-[10px]"></div>
                <p>Celle-ci est prévue pour le <strong>{moment(desactivationDate).format("DD/MM/YYYY")}</strong>.</p>
            </div>
        </div>
    )
}

const MaintenanceInformation: React.FC<{ maintenance: Maintenance }> = ({ maintenance }) => {

    return (
        <div className="flex justify-center text-base my-2">
            <div className="w-[90%] bg-white dark:bg-[#141f30] dark:text-white rounded-lg border border-[#e9620f] text-left py-1 px-2">
                <p className="text-[#e9620f]">Maintenance</p>
                <div className="h-[4px]"></div>
                <p>Début: <span className="text-slate-600 dark:text-slate-400">{moment(maintenance.startAt).format("DD/MM/YYYY à HH:mm")}</span></p>
                <p>Fin: <span className="text-slate-600 dark:text-slate-400">{moment(maintenance.endAt).format("DD/MM/YYYY à HH:mm")}</span></p>
                <div className="h-[10px]"></div>
                <p>{maintenance.message}</p>
            </div>
        </div>
    )
}

export default ProfileDashboardPage