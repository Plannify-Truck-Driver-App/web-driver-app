import TemplateWorkday from "components/templates/template-workday.component";
import useWorkday from "hooks/useWorkday.hook";
import React, { useEffect, useState } from "react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { CenterPageLoader } from "components/loaders";
import { Workday } from "models";
import moment from "moment";
import { ArrowRight, CalendarPlus, Trash2 } from "lucide-react";
import AddWorkdayModal from "components/molecules/add-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import SuspensionInformation from "components/informations/suspension.component";
import { NavigateFunction, useNavigate } from "react-router-dom";
import FlatInformation from "components/informations/flat-information.component";
import { toast } from "sonner";
import DateInput from "components/inputs/date.component";
import { PdfWorkdayMonthly } from "models/pdf-workday-monthly.model";
import PdfFile from "components/informations/pdf-file.component";
import { getPdfMonthApi } from "api/workday/get-pdf-month.api";
import { getAdvanceSearchWorkdayApi } from "api/workday/get-advance-search.api";
import { SecondaryButton } from "components/buttons";

const WorkdayDashboardPage: React.FC = () => {
    const { workdayContext, setWorkdayContext } = useWorkday();
    const { authentification, setAuthentification } = useAuthentification();

    const navigate: NavigateFunction = useNavigate();

    const [selectedView, setSelectedView] = useState<'currentMonth' | 'lastMonth' | 'custom'>('currentMonth')
    const [showAddWorkdayModal, setShowAddWorkdayModal] = useState<boolean>(false)

    const monthsString: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

    const currentDate: Date = new Date();
    const lastMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, Math.min(currentDate.getDate(), new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()));

    const navItems: { title: string, isSelected: boolean, onClick: () => void }[] = [
        {
            title: "Ce mois",
            isSelected: selectedView === 'currentMonth',
            onClick: () => setSelectedView('currentMonth')
        },
        {
            title: monthsString[lastMonthDate.getMonth()],
            isSelected: selectedView === 'lastMonth',
            onClick: () => setSelectedView('lastMonth')
        },
        {
            title: "Personnalisé",
            isSelected: selectedView === 'custom',
            onClick: () => setSelectedView('custom')
        }
    ]

    const onClickAddWorkday = () => {
        if (authentification && authentification.payload.deactivation) {
            toast.error("Votre compte est désactivé. Vous ne pouvez pas ajouter de journées.")
            return
        }

        setShowAddWorkdayModal(true)
    }

    const downloadWorkdayFile = async (month: number, year: number) => {
        const response = await getPdfMonthApi({ month: month, year: year }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success && response.data) {
            // Créer une URL pour le Blob
            const url = URL.createObjectURL(response.data);

            // Créer un élément de lien (a) et l'ajouter au document
            const link = document.createElement('a');
            link.href = url;
            link.download = "plannify-journee-" + year + "-" + month + ".pdf";

            // Append link to the body, trigger click, and then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Libérer l'URL après un court délai
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    }

    return (
        <TemplateWorkday title="Gestion des journées" selectedSection={NavBarSection.JOURNEYS} updateMetaForOverlay={showAddWorkdayModal} rightIcon={{ icon: <Trash2 color="white" />, onClick: () => navigate('/dashboard/journees/supprimees') }}  titleItems={navItems}>
            {
                authentification && authentification.payload.suspension ? (
                    <SuspensionInformation contactEmail={authentification.payload.suspension.contactEmail} />
                ) : (
                    workdayContext.workdaysMonth.loading ?
                    <CenterPageLoader content="Récupération de vos journées" /> :
                    <div className="px-4 w-full">
                        <div className="h-6"></div>
                        {
                            ['currentMonth', 'lastMonth'].includes(selectedView) ? (
                                <div>
                                    <div className="h-[30px]"></div>
                                    <p className="text-left dark:text-white">{
                                        selectedView === 'currentMonth' ? monthsString[currentDate.getMonth()] + " " + currentDate.getFullYear() : monthsString[lastMonthDate.getMonth()] + " " + lastMonthDate.getFullYear()
                                    }</p>
                                    <div className="h-[10px]"></div>
                                    <WorkdayList data={selectedView === 'currentMonth' ? workdayContext.workdaysMonth.data : workdayContext.workdaysLastMonth.data} navigate={navigate} downloadWorkdayFile={downloadWorkdayFile} />
                                    <div className="fixed right-5 bottom-[100px] flex flex-row items-center gap-2 py-2 px-4 bg-[#1887a3] text-white rounded-lg cursor-pointer" onClick={() => onClickAddWorkday()}>
                                        <p>Ajouter</p>
                                        <CalendarPlus />
                                    </div>
                                    <div className="h-40"></div>
                                </div>
                            ): (
                                <div>
                                    <AdvancedSearch />
                                </div>
                            )
                        }
                    </div>
                )
            }
            {
                showAddWorkdayModal ? <AddWorkdayModal onCancel={() => setShowAddWorkdayModal(false)} navigate={navigate} authentification={authentification} setAuthentification={setAuthentification} workdayContext={workdayContext} setWorkdayContext={setWorkdayContext} /> : <></>
            }
        </TemplateWorkday>
    )
}

const AdvancedSearch: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [inputs, setInputs] = useState<{ from: string, to: string }>({ from: '', to: '' })

    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<{ workdays: Workday[], pdfFile: PdfWorkdayMonthly | null }[]>([])
    const [pagination, setPagination] = useState<{ page: number, limit: number, total: number } | null>(null)

    const mois: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

    const fetchData = async (fromDate: string, endDate: string, page: number) => {
        if (fromDate === '' || endDate === '') {
            return
        }

        setLoading(true)
        const response = await getAdvanceSearchWorkdayApi({ startDate: new Date(fromDate), endDate: new Date(endDate), page: page }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });
        setLoading(false)

        if (response.success && response.data !== null) {
            setPagination(response.data.pagination)
            setData(response.data.research)
        }
    }

    const downloadWorkdayFile = async (month: number, year: number, setLoading: Function) => {
        setLoading(true)
        const response = await getPdfMonthApi({ month: month, year: year }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false)

        if (response.success && response.data) {
            // Créer une URL pour le Blob
            const url = URL.createObjectURL(response.data);

            // Créer un élément de lien (a) et l'ajouter au document
            const link = document.createElement('a');
            link.href = url;
            link.download = "plannify-journee-" + year + "-" + month + ".pdf";

            // Append link to the body, trigger click, and then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Libérer l'URL après un court délai
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    }

    useEffect(() => {
        fetchData(inputs.from, inputs.to, page);
    }, [inputs, page])

    return (
        <div>
            <div className="h-[10px]"></div>
            <div className="flex justify-around my-4 dark:text-white">
                <div className="flex flex-col items-start">
                    <label className="ml-1" htmlFor="from">De</label>
                    <DateInput id="from" value={inputs.from} isError={false} inputType="interactive" onChange={(e) => setInputs(prev => ({ to: prev.to, from: e.target.value }))} />
                </div>
                <div className="flex flex-col items-start">
                    <label className="ml-1" htmlFor="to">À</label>
                    <DateInput id="to" value={inputs.to} isError={false} inputType="interactive" onChange={(e) => setInputs(prev => ({ to: e.target.value, from: prev.from }))} />
                </div>
            </div>
            {
                pagination && page > 1 && (
                    <>
                        <SecondaryButton label="Page précédente" isDisabled={false} isLoading={loading} onClick={() => setPage(prev => prev - 1)} />
                        <div className="h-4"></div>
                    </>
                )
            }
            {
                inputs.from === '' || inputs.to === '' ? <p className="text-center text-slate-600 dark:text-slate-400">Les données seront chargées dès que les champs de saisies ne seront plus vides.</p> : (
                    loading ? <CenterPageLoader content="Recherche en cours" /> : (
                        data.length === 0 ? (
                            <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2 dark:text-white">
                                <p>Aucune journée trouvée.</p>
                            </div>
                        ) : (
                            data.map((workdayData, index) => (
                                <div key={index}>
                                    <p className="text-left ml-4 mb-2 dark:text-white">{ mois[workdayData.pdfFile ? workdayData.pdfFile.month - 1 : workdayData.workdays[0].workdayDate.getMonth()] } {workdayData.pdfFile ? workdayData.pdfFile.year : workdayData.workdays[0].workdayDate.getFullYear()}</p>
                                    {
                                        workdayData.pdfFile !== null ? (
                                            <div className="flex justify-center">
                                                <PdfFile file={workdayData.pdfFile} onClick={() => downloadWorkdayFile(workdayData.pdfFile!.month, workdayData.pdfFile!.year, () => {})} />
                                            </div>
                                        ) : (
                                            workdayData.workdays.length !== 0 && <WorkdayList data={workdayData} navigate={navigate} />
                                        )
                                    }
                                    {
                                        data.length - 1 !== index && <hr className="my-4 border-1 border-slate-600" />
                                    }
                                </div>
                            ))
                        )
                    )
                )
            }
            {
                pagination && page * pagination.limit < pagination.total && (
                    <>
                        <div className="h-4"></div>
                        <SecondaryButton label="Page suivante" isDisabled={false} isLoading={loading} onClick={() => setPage(prev => prev + 1)} />
                    </>
                )
            }
            <div className="h-40"></div>
        </div>
    )
}

interface WorkdayListProps {
    data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null },
    navigate: NavigateFunction,
    downloadWorkdayFile?: (month: number, year: number) => void
}

const WorkdayList: React.FC<WorkdayListProps> = ({ data, navigate, downloadWorkdayFile }) => {
    return (
        data.pdfFile !== null ? (
            <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2">
                <div className="flex justify-center">
                    <PdfFile file={data.pdfFile} onClick={downloadWorkdayFile ? () => downloadWorkdayFile(data.pdfFile!.month, data.pdfFile!.year) : undefined} />
                </div>
            </div>
        ) : (
            <>
                {
                    data.workdays.length === 0 ? (
                        <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2 dark:text-white">
                            <p>Aucune journée enregistrée.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-5 overflow-auto">
                            {
                                data.workdays.sort((a, b) => a.workdayDate.getTime() - b.workdayDate.getTime()).map((workday: Workday, index: number) => (
                                    <FlatInformation key={index} onClick={() => navigate('/dashboard/modifier-journee/' + moment(workday.workdayDate).format("YYYY-MM-DD"), { state: { workday: workday } })}>
                                        <div key={index} className="w-full flex flex-row justify-between items-center">
                                            <p>{moment(workday.workdayDate).format("DD/MM/YYYY")}</p>
                                            <div>
                                                <p className="flex items-center gap-1">{moment(workday.startHour).format("HH:mm:ss")}<ArrowRight size={18} color="rgb(71 85 105)" />{workday.endHour ? moment(workday.endHour).format("HH:mm:ss") : 'en cours'}</p>
                                                <p><span className="text-slate-600 dark:text-slate-400">Coupure : </span>{moment(workday.restPeriod).format("HH:mm:ss")}</p>
                                            </div>
                                        </div>
                                    </FlatInformation>
                                ))
                            }
                        </div>
                    )
                }
            </>
        )
    )
}

export default WorkdayDashboardPage