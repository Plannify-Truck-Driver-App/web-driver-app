import { getWorkdayApi } from "api/workday/get-workday.api";
import { getTrashWorkdayApi } from "api/workday/get-trash-workdays.api";
import { restoreWorkdayApi } from "api/workday/restore-workday.api";
import { MainButton, SecondaryButton } from "components/buttons";
import FlatInformation from "components/informations/flat-information.component";
import SuspensionInformation from "components/informations/suspension.component";
import { CenterPageLoader } from "components/loaders";
import CenterModal from "components/modals/center-modal.component";
import TemplateWorkday from "components/templates/template-workday.component"
import useAuthentification from "hooks/useAuthentification.hook";
import useWorkday from "hooks/useWorkday.hook";
import { Workday, TrashWorkday } from "models";
import { NavBarSection } from "models/enums/nav-bar-section.enum"
import moment from "moment";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeletedWorkdaysPage: React.FC = () => {
    const { workdayContext, setWorkdayContext } = useWorkday();
    const { authentification, setAuthentification } = useAuthentification();

    const navigate: NavigateFunction = useNavigate();

    const [trash, setTrash] = useState<TrashWorkday[]>([])
    const [loadingTrash, setLoadingTrash] = useState<boolean>(true)

    const [workdayRestore, setWorkdayRestore] = useState<TrashWorkday | null>(null)
    const [loadingRestoreWorkday, setLoadingRestoreWorkday] = useState<boolean>(false)

    const getTrash = async () => {
        setLoadingTrash(true)
        
        const response = await getTrashWorkdayApi(null, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate })

        if (response.success && response.data) {
            setTrash(response.data)
        }

        setLoadingTrash(false)
    }

    const onRestoreWorkday = async (workday: TrashWorkday) => {
        if (!workdayRestore) return setWorkdayRestore(workday)

        setLoadingRestoreWorkday(true)

        const response1 = await restoreWorkdayApi({ workdayDate: moment(workday.workdayDate).format("YYYY-MM-DD") }, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate })

        if (!response1.success) return setLoadingRestoreWorkday(false)

        const response2 = await getWorkdayApi({ workdayDate: moment(workday.workdayDate).format("YYYY-MM-DD") }, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate })

        if (response2.success) {
            const firstDayOfWeek: Date = new Date()
            firstDayOfWeek.setDate(new Date().getDate() + 1 - (firstDayOfWeek.getDay() === 0 ? 7 : new Date().getDay()))
            firstDayOfWeek.setHours(0, 0, 0, 0)
            const lastDayOfWeek: Date = new Date()
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
            lastDayOfWeek.setHours(23, 59, 59, 999)

            if (workday.workdayDate >= firstDayOfWeek && workday.workdayDate <= lastDayOfWeek) {
                setWorkdayContext(prev => ({ ...prev, workdaysWeek: { data: [...prev.workdaysWeek.data, response2.data!], loading: false } }))
            }

            if (workday.workdayDate.getMonth() === new Date().getMonth() && workday.workdayDate.getFullYear() === new Date().getFullYear()){
                setWorkdayContext(prev => ({ ...prev, workdaysMonth: { data: { workdays: [...prev.workdaysMonth.data.workdays, response2.data!], pdfFile: prev.workdaysMonth.data.pdfFile }, loading: false } }))
            }

            const oneMonthAgo: Date = new Date()
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
            if (workday.workdayDate.getMonth() === oneMonthAgo.getMonth() && workday.workdayDate.getFullYear() === oneMonthAgo.getFullYear()){
                setWorkdayContext(prev => ({ ...prev, workdaysLastMonth: { data: { workdays: [...prev.workdaysLastMonth.data.workdays, response2.data!], pdfFile: prev.workdaysLastMonth.data.pdfFile }, loading: false } }))
            }

            if (!workdayContext.pdfPeriods.data.find(pdfPeriod => pdfPeriod.month === workday.workdayDate.getMonth() + 1 && pdfPeriod.year === workday.workdayDate.getFullYear())) {
                setWorkdayContext(prev => ({ ...prev, pdfPeriods: { data: [...prev.pdfPeriods.data, { month: workday.workdayDate.getMonth() + 1, year: workday.workdayDate.getFullYear() }], loading: false } }))
            }

            toast.success("La journée a bien été restaurée.")
            setTrash(trash.filter((trashWorkday: TrashWorkday) => trashWorkday.workdayDate.getTime() !== workday.workdayDate.getTime()))
            setWorkdayRestore(null)
        }

        setLoadingRestoreWorkday(false)
    }

    useEffect(() => {
        getTrash()
    }, [authentification])

    return (
        <TemplateWorkday title="Journées supprimées" selectedSection={NavBarSection.JOURNEYS} onClickReturn={() => navigate('/dashboard/journees')} >
            {
                authentification && authentification.payload.suspension ? (
                    <SuspensionInformation contactEmail={authentification.payload.suspension.contactEmail} />
                ) : loadingTrash ? <CenterPageLoader content="Récupération de vos journées" /> : (
                    trash.length === 0 ? (
                        <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2">
                            <p className="dark:text-white">Aucune journée supprimée.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-5 overflow-auto">
                            {
                                trash.sort((a, b) => a.expectedDeletionDate.getTime() === b.expectedDeletionDate.getTime() ? a.workdayDate.getTime() - b.workdayDate.getTime() : a.expectedDeletionDate.getTime() - b.expectedDeletionDate.getTime()).map((workday: TrashWorkday, index: number) => (
                                    <FlatInformation key={index} onClick={() => setWorkdayRestore(workday)}>
                                        <div key={index} className="w-full flex flex-row justify-between items-center">
                                            <p>{ moment(workday.workdayDate).format("DD/MM/YYYY") }</p>
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400">Suppression définitive</p>
                                                <p>{ moment(workday.expectedDeletionDate).format("DD/MM/YYYY")  }</p>
                                            </div>
                                        </div>
                                    </FlatInformation>
                                ))
                            }
                            <div className="h-40"></div>
                            {
                                workdayRestore !== null && <CenterModal onCancel={() => setWorkdayRestore(null)} size={{desktop: 'relative', mobile: 'relative'}}>
                                    <div className="flex flex-col gap-4">
                                        <p>Êtes-vous sûr de vouloir restaurer la journée du { moment(workdayRestore.workdayDate).format("DD/MM/YYYY") } ?</p>
                                        <div className="flex justify-around gap-4">
                                            <SecondaryButton label="Non" onClick={() => setWorkdayRestore(null)} isDisabled={false} isLoading={false} />
                                            <MainButton label="Oui" onClick={() => onRestoreWorkday(workdayRestore)} isDisabled={false} isLoading={loadingRestoreWorkday} />
                                        </div>
                                    </div>
                                </CenterModal>
                            }
                        </div>
                    )
                )
            }
        </TemplateWorkday>
    )
}

export default DeletedWorkdaysPage