import { addWorkdayApi } from "api/workday/add-workday.api"
import { MainButton, SecondaryButton } from "components/buttons"
import { Selector } from "components/inputs"
import DateInput from "components/inputs/date.component"
import TimeInput from "components/inputs/time.component"
import { RestPeriod } from "models/rest-period.model"
import moment from "moment"
import { InputSwitch } from "primereact/inputswitch"
import { WorkdayProviderProps } from "providers/workday.provider"
import { useEffect, useState } from "react"
import { NavigateFunction } from "react-router-dom"
import { toast } from "sonner"
import { addWorkdayReplaceApi } from "api/workday/add-workday-replace.api"
import { ArrowRightLeft, Eraser } from "lucide-react"
import { Workday } from "models"
import UpModal from "../modals/up-modal.component"

interface IAddWorkdayModalProps {
    onCancel: () => void,
    navigate: NavigateFunction,
    authentification: any,
    setAuthentification: any,
    workdayContext: WorkdayProviderProps['workdayContext'],
    setWorkdayContext: WorkdayProviderProps['setWorkdayContext']
}

const AddWorkdayModal: React.FC<IAddWorkdayModalProps> = ({ onCancel, navigate, authentification, setAuthentification, workdayContext, setWorkdayContext }) => {
    const restPeriods: RestPeriod[] | null = workdayContext.restPeriods.data
    const months: string[] = ['de janvier', 'de février', 'de mars', "d'avril", 'de mai', 'de juin', 'de juillet', "d'août", 'de septembre', "d'octobre", 'de novembre', 'de décembre'];

    const [workdayInputs, setWorkdayInputs] = useState<{ date: string, startHour: string, endHour: string, rest: string, overnightRest: boolean }>({ date: moment().format("YYYY-MM-DD"), startHour: '', endHour: '', rest: restPeriods !== null && restPeriods.length > 0 ? 'automatique' : '00:00:00', overnightRest: false })
    const [workdayErrors, setWorkdayErrors] = useState<{ date: boolean, startHour: boolean, endHour: boolean, rest: boolean }>({ date: false, startHour: false, endHour: false, rest: false })

    const [loading, setLoading] = useState<boolean>(false)
    const [typeModalWarning, setTypeModalWarning] = useState<'duplicateWorkday' | 'existingPdfFile' | undefined>(undefined)

    const [useRestPeriodsContext, setUseRestPeriodsContext] = useState<boolean>(true);

    const isDateValid = (date: string): boolean => {
        return /^(0[1-9_]|1[0-9_]|2[0-9_]|3[01_])\/(0[1-9_]|1[0-2_]|__)\/([1-2_][0-9_][0-9_][0-9_])$/.test(date) || /^([12][0-9][0-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])$/.test(date) || date.trim().length === 0
    }

    const isHourValid = (hour: string): boolean => {
        return /^([01_][0-9_]|2[0-3_]):([0-5_][0-9_])(:([0-5_][0-9_]))?$/.test(hour) || hour.trim().length === 0
    }

    const onAddWorkday = async (dateText: string, startHour: string, endHour: string, rest: string, overnightRest: boolean) => {
        if (workdayErrors.date || workdayErrors.startHour || workdayErrors.endHour || workdayErrors.rest) return

        let stringDate: string = ""
        let workdayDate: Date = new Date()

        const dateParts = dateText.trim().split('/')
        if (dateParts.length === 3) {
            stringDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
            workdayDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]))
        } else if (dateText.trim().split('-').length === 3) {
            stringDate = dateText.trim()
            workdayDate = new Date(stringDate)
        }

        const startHourDate: Date = new Date(stringDate + " " + (startHour.split(':').length === 3 ? startHour : startHour + ':00'))
        const endHourDate: Date | null = endHour.length === 0 ? null : new Date(stringDate + " " + (endHour.split(':').length === 3 ? endHour : endHour + ':00'))
        let restPeriodDate: Date;

        if (rest === 'automatique' && endHourDate !== null && restPeriods !== null) {
            const restPeriodAuto: RestPeriod | undefined = Workday.getRestPeriod(startHourDate, endHourDate, restPeriods);

            if (restPeriodAuto) {
                restPeriodDate = restPeriodAuto.restTime;
            } else {
                restPeriodDate = new Date(stringDate + " " + "00:00:00")
            }
        }  else if (endHourDate === null && rest === 'automatique') {
            restPeriodDate = new Date(stringDate + ' ' + "00:00:00")
            setWorkdayInputs(prev => ({...prev, rest: '00:00:00'}))
        } else {
            restPeriodDate = new Date(stringDate + " " + (rest.split(':').length === 3 ? rest : rest + ':00'))
        }

        setLoading(true)
        const response = await addWorkdayApi({ workdayDate: workdayDate, startHour: startHourDate, endHour: endHourDate, restPeriod: restPeriodDate, overnightRest: overnightRest }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false)

        // if the workday already exists
        if (response.message === "Une journée existe déjà à cette date." || response.message === "Une journée existe déjà à cette date dans votre poubelle.") {
            setTypeModalWarning('duplicateWorkday')
            return
        } else if (response.message === "Le document PDF pour ce mois a déjà été généré, vous ne pouvez plus modifier ces journées.") {
            setTypeModalWarning('existingPdfFile')
            return
        }

        if (response.data && response.success) {
            const now: Date = new Date();

            const firstDayOfWeek: Date = new Date()
            const lastDayOfWeek: Date = new Date()

            // Get the day of the week (Sunday = 0, Monday = 1, ..., Saturday = 6)
            const weekDay: number = now.getDay();

            // Calculate the day difference to get Monday (if Sunday, go back 6 days)
            const mondayDiff: number = weekDay === 0 ? -6 : 1 - weekDay;

            // Adjust the date to get the first day of the week (Monday)
            firstDayOfWeek.setDate(now.getDate() + mondayDiff);
            firstDayOfWeek.setHours(0, 0, 0, 0);

            // Adjust the date to get the last day of the week (Sunday)
            lastDayOfWeek.setDate(now.getDate() + mondayDiff + 6);
            lastDayOfWeek.setHours(23, 59, 59, 59);

            if (workdayDate >= firstDayOfWeek && workdayDate <= lastDayOfWeek) {
                setWorkdayContext(prev => ({ ...prev, workdaysWeek: { data: [...prev.workdaysWeek.data, response.data!], loading: false } }))
            }

            if (workdayDate.getMonth() === new Date().getMonth() && workdayDate.getFullYear() === new Date().getFullYear()){
                setWorkdayContext(prev => ({ ...prev, workdaysMonth: { data: { workdays: [...prev.workdaysMonth.data.workdays, response.data!], pdfFile: prev.workdaysMonth.data.pdfFile }, loading: false } }))
            }

            const oneMonthAgo: Date = new Date()
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
            if (workdayDate.getMonth() === oneMonthAgo.getMonth() && workdayDate.getFullYear() === oneMonthAgo.getFullYear()){
                setWorkdayContext(prev => ({ ...prev, workdaysLastMonth: { data: { workdays: [...prev.workdaysLastMonth.data.workdays, response.data!], pdfFile: prev.workdaysLastMonth.data.pdfFile }, loading: false } }))
            }

            if (!workdayContext.pdfPeriods.data.find(pdfPeriod => pdfPeriod.month === workdayDate.getMonth() + 1 && pdfPeriod.year === workdayDate.getFullYear())) {
                setWorkdayContext(prev => ({ ...prev, pdfPeriods: { data: [...prev.pdfPeriods.data, { month: workdayDate.getMonth() + 1, year: workdayDate.getFullYear() }], loading: false } }))
            }

            onCancel()
            toast.success('Journée ajoutée avec succès')
        }
    }

    const onAddReplaceWorkday = async (dateText: string, startHour: string, endHour: string, rest: string, overnightRest: boolean) => {
        if (workdayErrors.date || workdayErrors.startHour || workdayErrors.endHour || workdayErrors.rest) return

        let stringDate: string = ''
        let workdayDate: Date = new Date()

        const dateParts = dateText.trim().split('/')
        if (dateParts.length === 3) {
            stringDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
            workdayDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]))
        } else if (dateText.trim().split('-').length === 3) {
            stringDate = dateText.trim()
            workdayDate = new Date(stringDate)
        }

        const startHourDate: Date = new Date(stringDate + " " + (startHour.split(':').length === 3 ? startHour : startHour + ':00'))
        const endHourDate: Date | null = endHour.length === 0 ? null : new Date(stringDate + " " + (endHour.split(':').length === 3 ? endHour : endHour + ':00'))
        let restPeriodDate: Date;

        if (rest === 'automatique' && endHourDate !== null && restPeriods !== null) {
            const restPeriodAuto: RestPeriod | undefined = Workday.getRestPeriod(startHourDate, endHourDate, restPeriods);

            if (restPeriodAuto) {
                restPeriodDate = restPeriodAuto.restTime;
            } else {
                restPeriodDate = new Date(stringDate + " " + "00:00:00")
            }
        } else {
            restPeriodDate = new Date(stringDate + " " + (rest.split(':').length === 3 ? rest : rest + ':00'))
        }

        setLoading(true)
        const response = await addWorkdayReplaceApi({ workdayDate: workdayDate, startHour: startHourDate, endHour: endHourDate, restPeriod: restPeriodDate, overnightRest: overnightRest }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification })
        setLoading(false)

        if (response.data && response.success) {
            const firstDayOfWeek: Date = new Date()
            firstDayOfWeek.setDate(new Date().getDate() + 1 - (firstDayOfWeek.getDay() === 0 ? 7 : new Date().getDay()))
            firstDayOfWeek.setHours(0, 0, 0, 0)
            const lastDayOfWeek: Date = new Date()
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
            lastDayOfWeek.setHours(23, 59, 59, 999)

            if (workdayDate >= firstDayOfWeek && workdayDate <= lastDayOfWeek) {
                setWorkdayContext(prev => ({ ...prev, workdaysWeek: { data: [...prev.workdaysWeek.data.filter(workday => moment(workday.workdayDate).format('YYYY-MM-DD') !== moment(workdayDate).format('YYYY-MM-DD')), response.data!], loading: false } }))
            }

            if (workdayDate.getMonth() === new Date().getMonth() && workdayDate.getFullYear() === new Date().getFullYear()){
                setWorkdayContext(prev => ({ ...prev, workdaysMonth: { data: { workdays: [...prev.workdaysMonth.data.workdays.filter(workday => moment(workday.workdayDate).format('YYYY-MM-DD') !== moment(workdayDate).format('YYYY-MM-DD')), response.data!], pdfFile: prev.workdaysMonth.data.pdfFile }, loading: false } }))
            }

            const oneMonthAgo: Date = new Date()
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
            if (workdayDate.getMonth() === oneMonthAgo.getMonth() && workdayDate.getFullYear() === oneMonthAgo.getFullYear()){
                setWorkdayContext(prev => ({ ...prev, workdaysLastMonth: { data: { workdays: [...prev.workdaysLastMonth.data.workdays.filter(workday => moment(workday.workdayDate).format('YYYY-MM-DD') !== moment(workdayDate).format('YYYY-MM-DD')), response.data!], pdfFile: prev.workdaysLastMonth.data.pdfFile }, loading: false } }))
            }

            if (!workdayContext.pdfPeriods.data.find(pdfPeriod => pdfPeriod.month === workdayDate.getMonth() + 1 && pdfPeriod.year === workdayDate.getFullYear())) {
                setWorkdayContext(prev => ({ ...prev, pdfPeriods: { data: [...prev.pdfPeriods.data.filter(pdf => pdf.month !== workdayDate.getMonth() + 1 && pdf.year !== workdayDate.getFullYear()), { month: workdayDate.getMonth() + 1, year: workdayDate.getFullYear() }], loading: false } }))
            }

            setTypeModalWarning(undefined)
            onCancel()
            toast.success('Journée ajoutée avec succès')
        }
    }

    const onSwitchTypeRestInput = () => {
        if (!useRestPeriodsContext) {
            const restPeriodInput: RestPeriod | undefined = restPeriods?.find(rest => moment(rest.restTime).format("HH:mm:ss") === workdayInputs.rest)
            if (restPeriodInput !== undefined) {
                setWorkdayInputs(prev => ({...prev, rest: moment(restPeriodInput.restTime).format("HH:mm:ss")}))
            } else {
                setWorkdayInputs(prev => ({...prev, rest: restPeriods && restPeriods.length > 0 ? 'automatique' : "00:00:00"}))
            }
        } else if (workdayInputs.rest === 'automatique') {
            setWorkdayInputs(prev => ({...prev, rest: '00:00:00'}))
        }

        setUseRestPeriodsContext(prev => !prev)
    }

    useEffect(() => {
        setWorkdayErrors(prev => ({...prev, date: !isDateValid(workdayInputs.date)}))

        setWorkdayErrors(prev => ({...prev, startHour: !isHourValid(workdayInputs.startHour)}))
        setWorkdayErrors(prev => ({...prev, endHour: !isHourValid(workdayInputs.endHour)}))
        setWorkdayErrors(prev => ({...prev, rest: !isHourValid(workdayInputs.rest) && workdayInputs.rest !== 'automatique'}))
    }, [workdayInputs.date, workdayInputs.startHour, workdayInputs.endHour, workdayInputs.rest])

    return (
        <UpModal onCancel={onCancel}>
            <div className="flex flex-row items-center justify-between">
                <p>Ajouter une journée</p>
                <p className="cursor-pointer underline" onClick={onCancel}>Annuler</p>
            </div>
            <div className="h-10"></div>
            {
                typeModalWarning === 'duplicateWorkday' ? (
                    <div>
                        <p>Une journée existe déjà à cette date !</p>
                        <p>Souhaitez-vous la remplacer par les informations que vous venez de saisir ?</p>
                        <div className="h-10"></div>
                        <div className="flex justify-center gap-4">
                            <SecondaryButton label="Non" onClick={() => setTypeModalWarning(undefined)} isDisabled={false} isLoading={false} />
                            <MainButton label="Oui" onClick={() => onAddReplaceWorkday(workdayInputs.date, workdayInputs.startHour, workdayInputs.endHour, workdayInputs.rest, workdayInputs.overnightRest)} isDisabled={false} isLoading={loading} />
                        </div>
                    </div>
                ) : (
                    typeModalWarning === 'existingPdfFile' ? (
                        <div>
                            <p>Le fichier PDF du mois { months[parseInt(moment(workdayInputs.date).format('MM')) - 1] } { moment(workdayInputs.date).format('YYYY') } a déjà été généré définitivement !</p>
                            <div className="h-2"></div>
                            <p>Vous ne pouvez donc plus intéragir avec les journées de ce mois.</p>
                            <div className="h-10"></div>
                            <div className="flex justify-center gap-4">
                                <SecondaryButton label="Retour" onClick={() => setTypeModalWarning(undefined)} isDisabled={false} isLoading={false} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-base flex flex-col gap-3">
                            <div className="flex flex-row items-center justify-center gap-2">
                                <label>Date</label>
                                <DateInput value={workdayInputs.date} isError={workdayErrors.date} inputType="interactive" onChange={(e) => setWorkdayInputs(prev => ({...prev, date: e.target.value}))} />
                            </div>
                            <div className="flex flex-row items-center justify-center gap-2">
                                <label>Heure de début</label>
                                <TimeInput value={workdayInputs.startHour} isError={workdayErrors.startHour} inputType="interactive" onChange={(e) => setWorkdayInputs(prev => ({...prev, startHour: e.target.value}))} />
                            </div>
                            <div className="flex flex-row items-center justify-center gap-4">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <label>Heure de fin</label>
                                    <TimeInput value={workdayInputs.endHour} isError={workdayErrors.endHour} inputType="interactive" onChange={(e) => setWorkdayInputs(prev => ({...prev, endHour: e.target.value}))} />
                                </div>
                                {
                                    workdayInputs.endHour.length !== 0 && (
                                        <Eraser color="rgb(15 118 110)" onClick={() => setWorkdayInputs(prev => ({...prev, endHour: ''}))} />
                                    )
                                }
                            </div>
                            <div className="flex flex-row items-center justify-center gap-4">
                                <div className="flex items-center gap-2">
                                <label>Coupure</label>
                                {
                                    restPeriods === null || (!restPeriods.find(rp => moment(rp.restTime).format('HH:mm:ss') === workdayInputs.rest) && workdayInputs.rest !== 'automatique') || !useRestPeriodsContext ? (
                                        <TimeInput value={workdayInputs.rest} isError={workdayErrors.rest} placeholder="00:00:00" inputType="interactive" onChange={(e) => setWorkdayInputs(prev => ({...prev, rest: (e.target.value.split(':').length === 2 ? e.target.value + ':00' : e.target.value)}))} />
                                    ) : (
                                        <Selector label="Coupure" options={[{ value: 'automatique', label: 'Automatique' }, ...restPeriods.map(restPeriod => ({ value: moment(restPeriod.restTime).format('HH:mm:ss'), label: moment(restPeriod.restTime).format('HH:mm:ss') }))]} isError={workdayErrors.rest} defaultValue={workdayInputs.rest} onChange={(valeur: string) => setWorkdayInputs(prev => ({...prev, rest: valeur}))} />
                                    )
                                }
                                </div>
                                {
                                    restPeriods !== null ? (
                                        <ArrowRightLeft color="rgb(15 118 110)" onClick={() => onSwitchTypeRestInput()} />
                                    ) : <></>
                                }
                            </div>
                            <div className="flex flex-row items-center justify-center gap-2">
                                <p>Découchage :&nbsp;</p>
                                <InputSwitch checked={workdayInputs.overnightRest} onChange={(e) => setWorkdayInputs(prev => ({...prev, overnightRest: !prev.overnightRest}))} />
                            </div>
                            <div className="h-4"></div>
                            <div className="text-center">
                                <div className="w-[60%] inline-block">
                                    <MainButton label="Ajouter" isDisabled={workdayErrors.date || workdayErrors.startHour || workdayErrors.endHour || workdayErrors.rest || workdayInputs.date.length === 0 || workdayInputs.startHour.length === 0} isLoading={loading} onClick={() => onAddWorkday(workdayInputs.date, workdayInputs.startHour, workdayInputs.endHour, workdayInputs.rest, workdayInputs.overnightRest)} />
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            {/* <div className="h-[60px]"></div> */}
        </UpModal>
    )
}

export default AddWorkdayModal