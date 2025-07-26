import { getMailsTypesApi } from "api/user/mails/get-mails-types.api";
import { CenterPageLoader, DotLoader } from "components/loaders";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { MailType } from "models/mail-type.model";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { getMailPreferencesApi } from "api/user/mails/get-mail-preferences.api";
import { toast } from "sonner";
import { deactivateMailPreferenceApi } from "api/user/mails/deactivate-mail-preference.api";
import { IContexteApi } from "api/error.api";
import { activateMailPreferenceApi } from "api/user/mails/activate-mail-preference.api";

const PereferencesMailPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [mailTypes, setMailTypes] = useState<MailType[] | null>(null)
    const [mailPreferences, setMailPreferences] = useState<number | null>(null)

    useEffect(() => {
        if (authentification) {
            getMailTypes()
        }
    }, [])

    const getMailTypes = async () => {
        const response = await getMailsTypesApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success && response.data !== null) {
            setMailTypes(response.data)
        }

        getMailPreferences()
    }

    const getMailPreferences = async () => {
        const response = await getMailPreferencesApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success && response.data !== null) {
            setMailPreferences(response.data.binary_preference)
        }
    }

    return (
        !authentification ? <></> :
        <TemplateWorkday title="Mes préférences de mail" onClickReturn={() => navigate('/parametres/mails')} selectedSection={NavBarSection.PROFILE}>
            <div className="h-4"></div>
            {
                mailTypes === null || mailPreferences === null ? <CenterPageLoader content="Récupération de tous les types de mail..." /> : (
                    mailTypes.length === 0 ? (
                        <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2 dark:text-white">
                            <p className="text-center">Aucun type de mail n'est disponible.</p>
                        </div>
                    ) : (
                        mailTypes.map((mailType, index) => {
                            return <MailTypeComponent key={index} mailType={mailType} isSelected={(mailPreferences & Math.pow(2, mailType.mailTypeId)) === Math.pow(2, mailType.mailTypeId)} context={{ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification }} />
                        })
                    )
                )
            }
            <div className="h-40"></div>
        </TemplateWorkday>
    )
}

const MailTypeComponent: React.FC<{ mailType: MailType, isSelected: boolean, context: IContexteApi }> = ({ mailType, isSelected, context }) => {
    const [checked, setChecked] = useState(isSelected);
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        if (mailType.isEditable) {
            if (checked) {
                setLoading(true)
                const response = await deactivateMailPreferenceApi({ mailTypeId: mailType.mailTypeId }, context)
                setLoading(false)

                if (response.success) {
                    setChecked(false)
                }
            } else {
                setLoading(true)
                const response = await activateMailPreferenceApi({ mailTypeId: mailType.mailTypeId }, context)
                setLoading(false)

                if (response.success) {
                    setChecked(true)
                }
            }
            
        } else {
            toast.warning("Ce type de mail ne peut pas être modifié.")
        }
    }

    return (
        <div className="w-full px-4 mb-8 cursor-pointer" onClick={() => onClick()}>
            <div className="flex flex-row justify-between items-center gap-6 dark:text-white">
                <p className="text-left">{ mailType.label }</p>
                <div>
                    {
                        loading ? <DotLoader /> : <InputSwitch checked={checked} onChange={() => {}} disabled={!mailType.isEditable} />
                    }
                </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-left text-base">{ mailType.description }</p>
        </div>
    )
}

export default PereferencesMailPage