import { getSupportContactEmailApi } from "api/help/get-contact-email.api";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { ArrowRight } from "lucide-react";
import { Suspension } from "models/suspension.model";
import moment from "moment";
import { useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";

const SuspensionPage: React.FC = () => {
  const location: Location = useLocation();
  const locationState: any = location.state;
  const [suspension, setSuspension] = useState<Suspension | null>(null)
  const [supportContactEmail, setSupportContactEmail] = useState<string | null>(null)

  const navigation: NavigateFunction = useNavigate()

  const getSupportContactEmail = async () => {
    const response = await getSupportContactEmailApi()

    if (response.success) {
      setSupportContactEmail(response.data)
    }
  }

  useEffect(() => {
    if (!locationState) {
      navigation("/connexion")
    } else {
      setSuspension(locationState.suspension)
      getSupportContactEmail()
    }
  }, [locationState, navigation])

  return (
    !suspension ? <p>Vous n'êtes pas autorisés à accéder à cette page.</p> : (
      <TemplateAuthentification title="Suspension" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_suspension.svg" alt="Suspension" /></div>, side: 'left' }} onClickReturn={() => navigation('/dashboard/compte')}>
        <div className="text-left">
          <p>
            Votre compte a été suspendu<br />
            <span className="text-slate-600 dark:text-slate-400">{suspension.message}</span>
          </p>
          <div style={{ height: '10px' }}></div>
          <p>Date de début : <span className="text-slate-600 dark:text-slate-400">{moment(suspension.startAt).format("DD/MM/YYYY HH:mm")}</span></p>
          <p>Date de fin : <span className="text-slate-600 dark:text-slate-400">{suspension.endAt ? moment(suspension.endAt).format("DD/MM/YYYY HH:mm") : "Non définie"}</span></p>
        </div>
        <hr className="border-0 border-b border-[#DADADA] my-5"/>
        <div className="text-left">
          <p>Vous contestez cette action ?</p>
          <div style={{ height: '10px' }}></div>
          <div className="grid grid-cols-[40px_1fr] gap">
            <ArrowRight className="w-[30px]"/>
            <p>
              Contactez-nous à l’adresse e-mail suivante pour avoir plus d’informations :<br/>
              {
                supportContactEmail === null ? (
                  "Chargement en cours..."
                ) : (
                  <a href={"mailto:" + supportContactEmail} className="text-[#4A7AB4]">{supportContactEmail}</a>
                )
              }
            </p>
          </div>
          <div style={{ height: '6px' }}></div>
          {
            suspension.endAt === null ? <div className="grid grid-cols-[40px_1fr] gap">
            <ArrowRight className="w-[30px]"/>
            <p>Vous recevrez sous 2 jours un mail contentant un fichier PDF avec toutes vos journées.</p>
          </div> : <></>
          }
        </div>
      </TemplateAuthentification>
    )
  )
}

export default SuspensionPage