import { getWorkdayApi } from "api/workday/get-workday.api";
import SuspensionInformation from "components/informations/suspension.component";
import { CenterPageLoader } from "components/loaders";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import { Workday } from "models";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import moment from "moment";
import { InputSwitch } from "primereact/inputswitch";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { useEffect, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRightLeft, Eraser, Trash2 } from "lucide-react";
import { MainButton, SecondaryButton } from "components/buttons";
import TimeInput from "components/inputs/time.component";
import { IUpdateWorkdayRequest, updateWorkdayApi } from "api/workday/update-workday.api";
import { toast } from "sonner";
import useWorkday from "hooks/useWorkday.hook";
import CenterModal from "components/modals/center-modal.component";
import { deleteWorkdayApi } from "api/workday/delete-workday.api";
import { RestPeriod } from "models/rest-period.model";
import { Selector } from "components/inputs";
import { getPeriodPdfMonthApi } from "api/workday/get-period-pdf-month.api";

const UpdateWorkdayPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const { workdayContext, setWorkdayContext } = useWorkday();

    const location: Location = useLocation();
    const locationState: any = location.state;

    const navigate: NavigateFunction = useNavigate();

    const { dateWorkday } = useParams<{ dateWorkday: string }>();

    const restPeriods: RestPeriod[] | null = workdayContext.restPeriods.data
    const dateString: string = dateWorkday ? dateWorkday : moment().format('YYYY-MM-DD');

    const [loadingGetWorkday, setLoadingGetWorkday] = useState<boolean>(false);
    const [errorParams, setErrorParams] = useState<boolean>(false);
    const [workday, setWorkday] = useState<Workday | null>(null);

    const [loadingPatchWorkday, setLoadingPatchWorkday] = useState<boolean>(false);
    const [canUpdateWorkday, setCanUpdateWorkday] = useState<boolean>(false);

    const [deleteWorkday, setDeleteWorkday] = useState<boolean>(false);
    const [deleteWorkdayLoading, setDeleteWorkdayLoading] = useState<boolean>(false);

    const [startHour, setStartHour] = useState<string>('');
    const [endHour, setEndHour] = useState<string>('');
    const [restPeriod, setRestPeriod] = useState<string>('');
    const [overnightRest, setOvernightRest] = useState<boolean>(false);

    const [useRestPeriodsContext, setUseRestPeriodsContext] = useState<boolean>(false);

    const isCorrectDate = (date: string): boolean => dateWorkday ? /^20[0-9]{2}-(((01|03|05|07|08|10|12)-(([0-2][1-9])|3[01]))|((04|06|09|11)-(([0-2][1-9])|30))|(02-(([0-1][1-9])|2[0-9])))$/.test(date) : false;

    const calculCanUpdateWorkday = (): boolean => {
        if (!workday) return false

        return startHour !== moment(workday.startHour).format('HH:mm') ||
            endHour !== (workday.endHour ? moment(workday.endHour).format('HH:mm') : '') ||
            restPeriod === 'automatique' ||
            restPeriod !== moment(workday.restPeriod).format('HH:mm:ss') ||
            overnightRest !== workday.overnightRest
    }

    const fetchWorkday = async (dateWorkday: string) => {
        setLoadingGetWorkday(true);

        const response = await getWorkdayApi({ workdayDate: dateWorkday }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success && response.data !== null) {
            setWorkday(response.data)

            setStartHour(moment(response.data.startHour).format('HH:mm'));
            setEndHour(response.data.endHour ? moment(response.data.endHour).format('HH:mm') : '');
            setRestPeriod(moment(response.data.restPeriod).format('HH:mm:ss'));
            setOvernightRest(response.data.overnightRest);
        }

        setLoadingGetWorkday(false);
    }

    const onUpdateWorkday = async () => {
        if (authentification && authentification.payload.deactivation) {
            toast.error("Votre compte est désactivé. Vous ne pouvez pas modifier de journées.")
            return
        }

        if (!workday) return

        setLoadingPatchWorkday(true);

        const request: IUpdateWorkdayRequest = {
            workdayDate: workday.workdayDate,
            startHour: new Date(moment(workday.workdayDate).format('YYYY-MM-DD') + ' ' + startHour),
            endHour: endHour ? new Date(moment(workday.workdayDate).format('YYYY-MM-DD') + ' ' + endHour) : null,
            restPeriod: new Date(moment(workday.workdayDate).format('YYYY-MM-DD') + ' ' + restPeriod),
            overnightRest: overnightRest
        }


        if (restPeriods && endHour !== '' && restPeriod === 'automatique') {
            const restPeriodAuto: RestPeriod | undefined = Workday.getRestPeriod(new Date(dateString + ' ' + startHour), new Date(dateString + ' ' + endHour), restPeriods);

            if (restPeriodAuto) {
                request.restPeriod = restPeriodAuto.restTime
            }
        } else if (endHour === '' && restPeriod === 'automatique') {
            request.restPeriod = new Date(moment(workday.workdayDate).format('YYYY-MM-DD') + ' ' + '00:00:00')
            setRestPeriod('00:00:00')
        }

        const response = await updateWorkdayApi(request, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        if (response.success && response.data !== null) {
            setWorkday(response.data)
            setRestPeriod(moment(response.data.restPeriod).format('HH:mm:ss'))

            const indexWorkdayMonth = workdayContext.workdaysMonth.data.workdays.findIndex(j => j.workdayDate.getDate() === workday.workdayDate.getDate())
            if (indexWorkdayMonth !== -1) {
                const newWorkdays = [...workdayContext.workdaysMonth.data.workdays]
                newWorkdays[indexWorkdayMonth] = response.data
                setWorkdayContext(prev => ({...prev, workdaysMonth: { data: { workdays: newWorkdays, pdfFile: prev.workdaysMonth.data.pdfFile }, loading: false } }) )
            } 

            const indexWorkdayLastMonth = workdayContext.workdaysLastMonth.data.workdays.findIndex(j => j.workdayDate.getDate() === workday.workdayDate.getDate())
            if (indexWorkdayLastMonth !== -1) {
                const newWorkdays = [...workdayContext.workdaysLastMonth.data.workdays]
                newWorkdays[indexWorkdayLastMonth] = response.data
                setWorkdayContext(prev => ({...prev, workdaysLastMonth: { data: { workdays: newWorkdays, pdfFile: prev.workdaysLastMonth.data.pdfFile }, loading: false } }) )
            }

            const indexWorkdayWeek = workdayContext.workdaysWeek.data.findIndex(j => j.workdayDate.getDate() === workday.workdayDate.getDate())
            if (indexWorkdayWeek !== -1) {
                const newWorkdays = [...workdayContext.workdaysWeek.data]
                newWorkdays[indexWorkdayWeek] = response.data
                setWorkdayContext(prev => ({...prev, workdaysWeek: { data: newWorkdays, loading: false } }) )
            }

            toast.success("Journée modifiée avec succès.")
        }

        setLoadingPatchWorkday(false);
    }

    const onDeleteWorkday = async () => {
        if (authentification && authentification.payload.deactivation) {
            toast.error("Votre compte est désactivé. Vous ne pouvez pas supprimer une journée.")
            return
        }

        if (!workday) return
        if (!deleteWorkday) return setDeleteWorkday(true)

        setDeleteWorkdayLoading(true);

        const response = await deleteWorkdayApi({ workdayDate: moment(workday.workdayDate).format("YYYY-MM-DD") }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })

        if (response.success) {
            if (workdayContext.workdaysMonth.data.workdays.find(j => moment(j.workdayDate).format("YYYY-MM-DD") === moment(workday.workdayDate).format("YYYY-MM-DD"))) {
                const newWorkdays = [...workdayContext.workdaysMonth.data.workdays.filter(j => moment(j.workdayDate).format("YYYY-MM-DD") !== moment(workday.workdayDate).format("YYYY-MM-DD"))]
                setWorkdayContext(prev => ({...prev, workdaysMonth: { data: { workdays: newWorkdays, pdfFile: prev.workdaysMonth.data.pdfFile }, loading: false } }) )
            }

            if (workdayContext.workdaysLastMonth.data.workdays.find(j => moment(j.workdayDate).format("YYYY-MM-DD") === moment(workday.workdayDate).format("YYYY-MM-DD"))) {
                const newWorkdays = [...workdayContext.workdaysLastMonth.data.workdays.filter(j => moment(j.workdayDate).format("YYYY-MM-DD") !== moment(workday.workdayDate).format("YYYY-MM-DD"))]
                setWorkdayContext(prev => ({...prev, workdaysLastMonth: { data: { workdays: newWorkdays, pdfFile: prev.workdaysLastMonth.data.pdfFile }, loading: false } }) )
            }

            if (workdayContext.workdaysWeek.data.find(j => moment(j.workdayDate).format("YYYY-MM-DD") === moment(workday.workdayDate).format("YYYY-MM-DD"))) {
                const newWorkdays = [...workdayContext.workdaysWeek.data.filter(j => moment(j.workdayDate).format("YYYY-MM-DD") !== moment(workday.workdayDate).format("YYYY-MM-DD"))]
                setWorkdayContext(prev => ({...prev, workdaysWeek: { data: newWorkdays, loading: false } }) )
            }

            updatePdfPeriods()

            toast.success("Journée supprimée avec succès.")
            navigate('/dashboard/journees')
        }

        setDeleteWorkdayLoading(false);
    }

    const updatePdfPeriods = async () => {
        setWorkdayContext(prev => ({ ...prev, pdfPeriods: { ...prev.pdfPeriods, loading: true } }))

        const response = await getPeriodPdfMonthApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success && response.data !== null)
            setWorkdayContext(prev => ({ ...prev, pdfPeriods: { ...prev.pdfPeriods, data: response.data! } }))

        setWorkdayContext(prev => ({ ...prev, pdfPeriods: { ...prev.pdfPeriods, loading: false } }))
    }

    const onSwitchTypeRestInput = () => {
        if (!useRestPeriodsContext) {
            const restPeriodInput: RestPeriod | undefined = restPeriods?.find(rest => moment(rest.restTime).format("HH:mm:ss") === restPeriod)
            if (restPeriodInput !== undefined) {
                setRestPeriod(moment(restPeriodInput.restTime).format("HH:mm:ss"))
            } else {
                setRestPeriod(restPeriods && restPeriods.length > 0 ? moment(restPeriods[0].restTime).format("HH:mm:ss") : "00:00:00")
            }
        } else if (restPeriod === 'automatique') {
            setRestPeriod('00:00:00')
        }

        setUseRestPeriodsContext(prev => !prev)
    }

    useEffect(() => {
        if (locationState) {
            setWorkday(locationState.workday)
            setStartHour(moment(locationState.workday.startHour).format('HH:mm'));
            setEndHour(locationState.workday.endHour ? moment(locationState.workday.endHour).format('HH:mm') : '');
            setRestPeriod(moment(locationState.workday.restPeriod).format('HH:mm:ss'));
            setOvernightRest(locationState.workday.overnightRest);
        } else if (dateWorkday === undefined || !isCorrectDate(dateWorkday)) {
            setErrorParams(true);
            setLoadingGetWorkday(false);
            return
        } else {
            fetchWorkday(dateWorkday);
        }
    }, [dateWorkday])

    useEffect(() => {
        setUseRestPeriodsContext(restPeriods !== null && workday !== null && restPeriods.find(rp => moment(rp.restTime).format('HH:mm:ss') === moment(workday.restPeriod).format('HH:mm:ss')) !== undefined)
    }, [restPeriods, workday])

    useEffect(() => {
        setCanUpdateWorkday(calculCanUpdateWorkday())
    }, [workday, startHour, endHour, restPeriod, overnightRest])

    return (
        <TemplateWorkday title="Modifier une journée" selectedSection={NavBarSection.JOURNEYS} onClickReturn={() => navigate('/dashboard/journees')} updateMetaForOverlay={false} >
            {
                authentification && authentification.payload.suspension ? (
                    <SuspensionInformation contactEmail={authentification.payload.suspension.contactEmail} />
                ) : (
                    loadingGetWorkday ? <CenterPageLoader content="Chargement de la journée" /> : (
                        errorParams ? (
                            <div className='absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2'>
                                <div className="px-4 text-center dark:text-white">
                                    <p>Paramètres incorrects...</p>
                                </div>
                            </div>
                        ) :
                        !workday ? (
                            <div className='absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2'>
                                <div className="px-4 text-center dark:text-white">
                                    <p>Aucune journée n'a été trouvée.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 px-4 dark:text-white">
                                <div className="flex gap-2 items-center justify-end text-red-600 py-2" onClick={() => onDeleteWorkday()}>
                                    <p>Supprimer</p>
                                    <Trash2 size={18} />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex">
                                        <p>Date :&nbsp;</p>
                                        <p className="text-slate-600 dark:text-slate-400">{ moment(workday.workdayDate).format("DD/MM/YYYY") }</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p>Heure de début :&nbsp;</p>
                                        <TimeInput value={startHour} isError={false} inputType="interactive" onChange={(e) => setStartHour(e.target.value)} />
                                    </div>
                                    <div className="flex flex-row items-center gap-4">
                                        <div className="flex items-center">
                                            <p>Heure de fin :&nbsp;</p>
                                            <TimeInput value={endHour} isError={false} inputType="interactive" onChange={(e) => setEndHour(e.target.value)} />
                                        </div>
                                        {
                                            workday && endHour !== '' && <Eraser color="rgb(15 118 110)" onClick={() => setEndHour('')} />
                                        }
                                    </div>
                                    <div className="flex flex-row items-center gap-4">
                                        <div className="flex items-center">
                                            <p>Coupure :&nbsp;</p>
                                            {
                                                restPeriods === null || !restPeriods.find(rp => moment(rp.restTime).format('HH:mm:ss') === restPeriod) && restPeriod !== 'automatique' || !useRestPeriodsContext ? (
                                                    <TimeInput value={restPeriod} isError={false} inputType="interactive" onChange={(e) => setRestPeriod((e.target.value.split(':').length == 2 ? e.target.value + ':00' : e.target.value))} />
                                                ) : (
                                                    <Selector label="Coupure" options={[{ value: 'automatique', label: 'Automatique' }, ...restPeriods.map(restPeriod => ({ value: moment(restPeriod.restTime).format('HH:mm:ss'), label: moment(restPeriod.restTime).format('HH:mm:ss') }))]} isError={false} defaultValue={restPeriod} onChange={(valeur: string) => setRestPeriod(valeur)} />
                                                )
                                            }
                                        </div>
                                        {
                                            restPeriods !== null ? (
                                                <ArrowRightLeft color="rgb(15 118 110)" onClick={() => onSwitchTypeRestInput()} />
                                            ) : <></>
                                        }
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <p>Découchage :&nbsp;</p>
                                        <InputSwitch checked={overnightRest} onChange={(e) => setOvernightRest(prev => !prev)} />
                                    </div>
                                </div>
                                <div>
                                    <MainButton label="Enregistrer" isDisabled={!canUpdateWorkday} isLoading={loadingPatchWorkday} onClick={() => onUpdateWorkday()}/>
                                </div>
                                {
                                    deleteWorkday && <CenterModal onCancel={() => setDeleteWorkday(false)} size={{desktop: 'relative', mobile: 'relative'}}>
                                        <div className="flex flex-col gap-4">
                                            <p>Êtes-vous sûr de vouloir supprimer cette journée ?</p>
                                            <div className="flex justify-around gap-4">
                                                <SecondaryButton label="Non" onClick={() => setDeleteWorkday(false)} isDisabled={false} isLoading={false} />
                                                <MainButton label="Oui" onClick={() => onDeleteWorkday()} isDisabled={false} isLoading={deleteWorkdayLoading} />
                                            </div>
                                        </div>
                                    </CenterModal>
                                }
                            </div>
                        )
                    )
                )
            }
        </TemplateWorkday>
    )
}

export default UpdateWorkdayPage