import { getSupportContactEmailApi } from "api/help/get-contact-email.api";
import { CenterPageLoader } from "components/loaders";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

const AssistancePage: React.FC = () => {
    const { authentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [supportContactEmail, setSupportContactEmail] = useState<string | null>(null)

    const getSupportContactEmail = async () => {
        const response = await getSupportContactEmailApi()
    
        if (response.success) {
          setSupportContactEmail(response.data)
        }
    }

    useEffect(() => {
        getSupportContactEmail()
    }, [])

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Assistance" onClickReturn={() => navigate('/dashboard/compte')} selectedSection={NavBarSection.PROFILE}>
            {
                supportContactEmail === null ? (
                    <CenterPageLoader content="Récupération des informations de contact en cours..." />
                ) : (
                    <>
                        <div className="w-[60%] inline-block">
                            <img src="/images/undraw_assistance.svg" alt="Besoin d'assistance" />
                        </div>
                        <div className="flex flex-col gap-2 text-left px-4 text-base dark:text-white">
                            {/* <p>Besoin d'assistance ? Pas de soucis, nous sommes disponible pour répondre à vos interrogations et/ou problèmes !</p> */}
                            <p>Vous pouvez nous contacter à l'adresse e-mail suivante et nous vous répondrons dans les meilleurs délais : <a href={"mailto:" + supportContactEmail} className="text-[#4A7AB4]">{ supportContactEmail }</a>.</p>
                            <p><b>Attention</b> : Veuillez utiliser votre adresse e-mail d'inscription (<span className="underline">{ authentification.payload.user.email }</span>) afin que votre mail soit traité.</p>
                        </div>
                    </>
                )
            }
            
            
        </TemplateWorkday>
    )
}

export default AssistancePage;