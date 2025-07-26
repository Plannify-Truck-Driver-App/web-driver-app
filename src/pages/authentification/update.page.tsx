import { getAppUpdatesApi } from "api/help/get-app-updates.api";
import { MainButton, SecondaryButton } from "components/buttons";
import { CenterPageLoader } from "components/loaders";
import CenterModal from "components/modals/center-modal.component";
import TemplateAuthentification from "components/templates/template-authentification.component";
import { MoveRight, X } from "lucide-react";
import { Update } from "models/update.model";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UpdatePage: React.FC = () => {
  const navigation: NavigateFunction = useNavigate()

  const [loading, setLoading] = useState<boolean>(false)
  const [updates, setUpdates] = useState<Update[] | null>(null)

  const [showUpdateDetails, setShowUpdateDetails] = useState<boolean>(false)

  useEffect(() => {
    fetchUpdates()
  }, [])

  useEffect(() => {
    const isUpdated = localStorage.getItem('isUpdated');

    if (isUpdated) {
      // Delete the indicator after the redirection
      localStorage.removeItem('isUpdated');
      toast.success('Mise à jour effectuée avec succès !');
      // Redirect to the new page
      navigation('/dashboard/semaine');
    }
  }, [navigation]);

  const fetchUpdates = async () => {
    setLoading(true)
    const response = await getAppUpdatesApi()
    setLoading(false)

    if (response.success && response.data !== null) {
      setUpdates(response.data)
    }
  }

  const updateApp = () => {
    localStorage.setItem('isUpdated', 'true');
    window.location.reload();
  }

  return (
    <>
      <TemplateAuthentification title="Mise à jour" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_update.svg" alt="Une mise à jour" /></div>, side: 'left' }} >
        <div className="sm:flex sm:flex-col sm:justify-around sm:content-around sm:h-full">
          {
            loading ? <div className="sm:relative"><CenterPageLoader content="Récupération des mise à jours..." /></div> :
            <>
              <div className="sm:hidden">
                <img src="/images/undraw_update.svg" alt="Une mise à jour" className="inline-block w-[60%]" />
                <div className="h-4"></div>
              </div>
              {
                updates === null || updates.length === 0 ? (
                  <>
                    <p>Aucune mise à jour n'est programmée, votre application est fonctionnelle !</p>
                    <div>
                      <SecondaryButton label="Retourner à mon espace" isDisabled={false} isLoading={false} onClick={() => navigation('/dashboard/semaine')} />
                    </div>
                  </>
                ) : (
                  <>
                    <p>Une nouvelle mise à jour de l'application est disponible !</p>
                    <div className="flex justify-center items-center gap-4">
                      <p className="text-[#c53b4c]">{ process.env.REACT_APP_VERSION }</p>
                      <MoveRight size={18} />
                      <p className="text-[#33ad3c]">{ updates[updates.length - 1].version }</p>
                    </div>
                    <div className="sm:h-0 h-8"></div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <SecondaryButton label="Voir les nouveautés" isDisabled={false} isLoading={false} onClick={() => setShowUpdateDetails(true)} />
                      <MainButton label="Mettre à jour" isDisabled={false} isLoading={false} onClick={() => updateApp()} />
                    </div>
                  </>
                )
              }
            </>
          }
        </div>
      </TemplateAuthentification>
      {
        showUpdateDetails && (
          <CenterModal onCancel={() => setShowUpdateDetails(false)} width="sm:w-fit sm:max-w-[80%] w-[90%]" size={{desktop: 'relative', mobile: 'relative'}}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl">Mises à jours</p>
                <X size={24} className="cursor-pointer" onClick={() => setShowUpdateDetails(false)} />
              </div>
              <div className="flex flex-col gap-2">
                {
                  updates && updates.map((update: Update, index: number) => (
                    <div key={index} className="flex flex-col gap">
                      <b>{update.version}</b>
                      <p>{update.description}</p>
                    </div>
                  ))
                }
              </div>
          </div>
          </CenterModal>
        )
      }
    </>
  )
}

export default UpdatePage