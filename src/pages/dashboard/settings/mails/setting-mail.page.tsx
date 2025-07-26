import { getMailsApi } from "api/user/mails/get-mails.api";
import MailInformation from "components/informations/mail-information.component";
import FlatInformation from "components/informations/flat-information.component";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { Inbox, MailQuestion, X } from "lucide-react";
import { Mail } from "models";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { MailType } from "models/mail-type.model";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { getMailsTypesApi } from "api/user/mails/get-mails-types.api";
import { CenterPageLoader } from "components/loaders";
import { SecondaryButton } from "components/buttons";
import MailFilter from "components/molecules/mail-filter.component";

const SettingMailPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [params, setParams] = useState<{
        page: number,
        from: string | undefined,
        to: string | undefined,
        type: number | undefined,
        status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined
    }>({
        page: 1,
        from: undefined,
        to: undefined,
        type: undefined,
        status: undefined
    })
    const [mails, setMails] = useState<Mail[] | null>(null)
    const [pagination, setPagination] = useState<{ total: number, currentPage: number, limit: number } | undefined>(undefined)
    const [mailTypes, setMailTypes] = useState<MailType[] | null>(null)

    const [showFilters, setShowFilters] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [filterNumber, setFilterNumber] = useState<number>(0)

    useEffect(() => {
        if (authentification) {
            getMails(params)
        }
    }, [params.page])

    useEffect(() => {
        setFilterNumber((params.from ? 1 : 0) + (params.to ? 1 : 0) + (params.status ? 1 : 0) + (params.type ? 1 : 0))
    }, [params])

    const getMails = async (params: { page: number, from: string | undefined, to: string | undefined, type: number | undefined, status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined }) => {
        setLoading(true)
        const response = await getMailsApi({ ...params }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false)

        if (response.success && response.data !== null) {
            setMails(response.data)
            setPagination(response.pagination)
            getMailTypes()
        }
    }

    const getMailTypes = async () => {
        const response = await getMailsTypesApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success && response.data !== null) {
            setMailTypes(response.data!)
        }
    }

    const updateFilter = (p: { page: number, from: string | undefined, to: string | undefined, type: number | undefined, status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined }) => {
        setParams(p)
        getMails(p)
    }

    return (
        !authentification ? <></> :
        <>
            <TemplateWorkday title="Mes mails" onClickReturn={() => navigate('/dashboard/compte')} selectedSection={NavBarSection.PROFILE} updateMetaForOverlay={showFilters} >
                <div className="w-full flex flex-col items-center gap-6 py-4">
                    <FlatInformation onClick={() => navigate("/parametres/mails/preferences")}>
                        <div className="w-full flex flex-row items-center gap-2">
                            <div className="p-2">
                                <MailQuestion />
                            </div>
                            <p>Modifier mes préférences</p>
                        </div>
                    </FlatInformation>
                </div>
                <div className="text-base px-6 my-4 mt-8 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2 dark:text-white">
                        <Inbox />
                        <p>Mails envoyés</p>
                        {
                            pagination ? <p className="text-slate-600 dark:text-slate-400">({ pagination.total >= 100 ? '+99' : pagination.total })</p> : <></>
                        }
                    </div>
                    <p className="underline cursor-pointer dark:text-white" onClick={() => setShowFilters(true)}>Filtres {filterNumber > 0 && `(${filterNumber})`}</p>
                </div>
                {
                    pagination && params.page > 1 && (
                        <>
                            <SecondaryButton label="Page précédente" isDisabled={false} isLoading={loading} onClick={() => setParams(prev => ({...prev, page: prev.page - 1 }))} />
                            <div className="h-4"></div>
                        </>
                    )
                }
                {
                    loading || mails === null || mailTypes === null ? <CenterPageLoader content="Récupération des mails..." /> : (
                        mails.length === 0 ? (
                            <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2">
                                <p className="text-center">Aucun mail n'a été trouvé.</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-base w-full flex flex-col items-center gap-4">
                                    {
                                        mails.map((mail: Mail, index: number) => {
                                            return (
                                                <MailInformation key={index} mail={mail} mailType={mailTypes.find(t => t.mailTypeId === mail.mailTypeId)} />
                                            )
                                        })
                                    }
                                </div>
                                {
                                    pagination && params.page * pagination.limit < pagination.total && (
                                        <>
                                            <div className="h-4"></div>
                                            <SecondaryButton label="Page suivante" isDisabled={false} isLoading={loading} onClick={() => setParams(prev => ({...prev, page: prev.page + 1 }))} />
                                        </>
                                    )
                                }
                                <div className="h-40"></div>
                            </>
                        )
                    )
                }
            </TemplateWorkday>
            {
                showFilters && <MailFilter params={params} mailTypes={mailTypes ?? []} toggleModal={() => setShowFilters(false)} updateParams={(p) => updateFilter(p)} />
            }
        </>
    )
}

export default SettingMailPage