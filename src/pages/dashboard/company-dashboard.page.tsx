import TemplateWorkday from "components/templates/template-workday.component";
import React, { useState } from "react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { MainButton } from "components/buttons";
import useAuthentification from "hooks/useAuthentification.hook";
import SuspensionInformation from "components/informations/suspension.component";
import Information from "components/informations/information.component";

const CompanyDashboardPage: React.FC = () => {
    const { authentification } = useAuthentification();

    const [showCompanyUnavailable, setShowCompanyUnavailable] = useState<boolean>(false)

    return (
        showCompanyUnavailable ? 
        <CompanyUnavailable /> :
        <TemplateWorkday title="Entreprise" selectedSection={NavBarSection.COMPANY}>
            {
                authentification && authentification.payload.suspension ? (
                    <SuspensionInformation contactEmail={authentification.payload.suspension.contactEmail} />
                ) : (
                    <div className="text-base px-1 w-full absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2">
                        <p className="dark:text-white">Vous n'êtes rattachés à aucune entreprise pour le moment.</p>
                        <div className="h-[50px]"></div>
                        <div className="flex justify-center">
                            <div className="w-[80%]">
                                <img src="/images/undraw_delivery_truck.svg" alt="Camion de livraison" />
                            </div>
                        </div>
                        <div className="h-[50px]"></div>
                        <div className="flex justify-center">
                            <MainButton label="Rechercher une entreprise" onClick={() => setShowCompanyUnavailable(true)} isDisabled={false} isLoading={false} />
                        </div>
                    </div>
                )
            }
        </TemplateWorkday>
    )
}

const CompanyUnavailable: React.FC = () => {

    return (
        <TemplateWorkday title="Entreprise" selectedSection={NavBarSection.COMPANY}>
            <div className="text-base py-3 text-left dark:text-white">
                <div className="px-4">
                    <h1 className="text-lg">Liaison à une entreprise</h1>
                    <div className="h-6"></div>
                    <p>Oups cette fonctionnalité n'est pas encore disponible... <span className="italic">Mais qu'est-ce que c'est ??</span></p>
                    <div className="h-6"></div>
                    <p>
                        Vous pourrez ici rechercher des entreprises et <strong>si vous le souhaitez</strong>, demander un accord professionnel.
                    </p>
                </div>
                <div className="h-6"></div>
                <div className="text-center">
                    <Information borderColor={{ light: "FC3EE1", dark: "FC3EE1" }} backgroundColor={{ light: "FFF8FE", dark: "141f30" }} emoji="💯" >
                        <p>Être associé à une entreprise et facilité l'échange d'informations avec votre employeur depuis l'application Plannify.</p>
                    </Information>
                    <Information borderColor={{ light: "F18920", dark: "F18920" }} backgroundColor={{ light: "FEFDFC", dark: "141f30" }} emoji="🚀" >
                        <p>Recevoir le détail de vos tournées en temps réel et visualiser les prochaines à venir !</p>
                    </Information>
                    <Information borderColor={{ light: "FA3A3A", dark: "FA3A3A" }} backgroundColor={{ light: "FFF8F8", dark: "141f30" }} emoji="🚛" >
                        <p>Vous pourrez être associé à un camion et visualiser les informations qui lui seront associées.</p>
                    </Information>
                    <Information borderColor={{ light: "65E93F", dark: "65E93F" }} backgroundColor={{ light: "F8FFF6", dark: "141f30" }} emoji="📄" >
                        <p>Automatiser l'envoi de vos bons de livraison aux clients de votre entreprise.</p>
                    </Information>
                </div>
                <div className="h-40"></div>
            </div>
        </TemplateWorkday>
    )
}

export default CompanyDashboardPage