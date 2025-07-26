import TemplateWorkday from "components/templates/template-workday.component";
import useWorkday from "hooks/useWorkday.hook";
import { Workday } from "models";
import React, { useEffect, useState } from "react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { MainButton, SecondaryButton } from "components/buttons";
import { CenterPageLoader } from "components/loaders";
import useAuthentification from "hooks/useAuthentification.hook";
import SuspensionInformation from "components/informations/suspension.component";
import { NavigateFunction, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "sonner";
import { addWorkdayApi } from "api/workday/add-workday.api";
import { updateWorkdayApi } from "api/workday/update-workday.api";
import { RestPeriod } from "models/rest-period.model";
import CenterModal from "components/modals/center-modal.component";
import TimeInput from "components/inputs/time.component";

const WeekDashboardPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const { workdayContext, setWorkdayContext } = useWorkday();

    const navigate: NavigateFunction = useNavigate();

    const [updateWorkday, setUpdateWorkday] = useState<boolean>(false);
    const [stateWorkday, setStateWorkday] = useState<Workday | undefined>(undefined);

    const [cancelEndWorkdayConfirmation, setCancelEndWorkdayConfirmation] = useState<boolean>(false);

    const [restPeriodWithoutAutomatisationInput, setRestPeriodWithoutAutomatisationInput] = useState<string>('00:00');
    const [askRestPeriod, setAskRestPeriod] = useState<boolean>(false);

    useEffect(() => {
        setStateWorkday(workdayContext.workdaysWeek.data.find(j => {
            const start = moment(j.startHour);
            const now = moment();
            const hoursDiff = now.diff(start, 'hours');
            
            return (hoursDiff < 18 && hoursDiff >= 0) || moment(j.workdayDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
        }));
    }, [workdayContext.workdaysWeek.data]);

    const startWorkday = async () => {
        if (authentification && authentification.payload.deactivation) {
            toast.error("Votre compte est désactivé. Vous ne pouvez pas commencer une journée.")
            return
        }

        if (stateWorkday) {
            toast.error("Vous avez déjà commencé votre journée.");
            return;
        }

        const currentMoment: Date = new Date();

        setUpdateWorkday(true);
        const request = await addWorkdayApi({ workdayDate: currentMoment, startHour: currentMoment, endHour: null, restPeriod: new Date(moment(currentMoment).format('YYYY-MM-DD') + ' 00:00:00'), overnightRest: false }, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate });
        setUpdateWorkday(false);

        if (request.success && request.data !== null) {
            setWorkdayContext(prev => ({
                ...prev,
                workdaysWeek: {
                    ...prev.workdaysWeek,
                    data: [
                        ...prev.workdaysWeek.data, request.data!
                    ]
                },
                workdaysMonth: {
                    ...prev.workdaysMonth,
                    data: {
                        workdays: [
                            ...prev.workdaysMonth.data.workdays, request.data!
                        ],
                        pdfFile: prev.workdaysMonth.data.pdfFile
                    }
                },
                pdfPeriods: {
                    ...prev.pdfPeriods,
                    data: [
                        ...prev.pdfPeriods.data.filter(
                            pdf => !(pdf.month === request.data!.workdayDate.getMonth() + 1 && pdf.year === request.data!.workdayDate.getFullYear())
                        ), {
                            month: request.data!.workdayDate.getMonth() + 1,
                            year: request.data!.workdayDate.getFullYear()
                        }
                    ]
                }
            }));

            setStateWorkday(request.data)
            toast.success("La journée a bien été créée.");
        }
    }

    const endWorkday = async () => {
        if (!stateWorkday) {
            toast.error("Vous n'avez pas commencé de journée.");
            return;
        }

        const currentMoment: Date = new Date();
        let restPeriodAuto: RestPeriod | undefined = undefined;

        if (workdayContext.restPeriods.data !== null) {
            restPeriodAuto = Workday.getRestPeriod(stateWorkday.startHour, currentMoment, workdayContext.restPeriods.data);
        }
        

        setUpdateWorkday(true);
        const request = await updateWorkdayApi({ workdayDate: stateWorkday.workdayDate, startHour: stateWorkday.startHour, endHour: currentMoment, restPeriod: restPeriodAuto ? restPeriodAuto.restTime : new Date(moment(currentMoment).format('YYYY-MM-DD') + ' ' + restPeriodWithoutAutomatisationInput + ':00'), overnightRest: false }, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate });
        setUpdateWorkday(false);

        if (request.success && request.data !== null) {
            setWorkdayContext(prev => ({...prev, workdaysWeek: {...prev.workdaysWeek, data: [...prev.workdaysWeek.data.filter(j => moment(j.workdayDate).format('YYYY-MM-DD') !== moment(request.data!.workdayDate).format('YYYY-MM-DD')), request.data!] }, workdaysMonth: {...prev.workdaysMonth, data: { workdays: [...prev.workdaysMonth.data.workdays.filter(j => moment(j.workdayDate).format('YYYY-MM-DD') !== moment(request.data!.workdayDate).format('YYYY-MM-DD')), request.data!], pdfFile: prev.workdaysMonth.data.pdfFile } }}));
            setStateWorkday(request.data);
            setAskRestPeriod(false);
            setRestPeriodWithoutAutomatisationInput('00:00');
            toast.success("La journée a bien été terminée.");
        }
    }

    const cancelEndWorkday = async () => {
        if (!stateWorkday) {
            toast.error("Vous n'avez pas commencé de journée.");
            return;
        }

        if (!cancelEndWorkdayConfirmation) {
            setCancelEndWorkdayConfirmation(true);
            return;
        }

        setUpdateWorkday(true);
        const request = await updateWorkdayApi({ workdayDate: stateWorkday.workdayDate, startHour: stateWorkday.startHour, endHour: null, restPeriod: stateWorkday.restPeriod, overnightRest: stateWorkday.overnightRest }, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate });
        setUpdateWorkday(false);

        if (request.success && request.data !== null) {
            setWorkdayContext(prev => ({...prev, workdaysWeek: {...prev.workdaysWeek, data: [...prev.workdaysWeek.data.filter(j => moment(j.workdayDate).format('YYYY-MM-DD') !== moment(request.data!.workdayDate).format('YYYY-MM-DD')), request.data!] }, workdaysMonth: {...prev.workdaysMonth, data: { workdays: [...prev.workdaysMonth.data.workdays.filter(j => moment(j.workdayDate).format('YYYY-MM-DD') !== moment(request.data!.workdayDate).format('YYYY-MM-DD')), request.data!], pdfFile: prev.workdaysMonth.data.pdfFile } }}));
            setStateWorkday(request.data)
            toast.success("La fin de journée a bien été annulée.");
        }

        setCancelEndWorkdayConfirmation(false);
    }

    const updateOvernightRest = async (value: boolean) => {
        if (!stateWorkday) {
            toast.error("Vous n'avez pas commencé de journée.");
            return;
        }

        setUpdateWorkday(true);
        const request = await updateWorkdayApi({ workdayDate: stateWorkday.workdayDate, startHour: stateWorkday.startHour, endHour: stateWorkday.endHour, restPeriod: stateWorkday.restPeriod, overnightRest: value }, { authentification: authentification, setAuthentification: setAuthentification, navigation: navigate });
        setUpdateWorkday(false);

        if (request.success && request.data !== null) {
            setWorkdayContext(prev => ({...prev, workdaysWeek: {...prev.workdaysWeek, data: [...prev.workdaysWeek.data.filter(j => moment(j.workdayDate).format('YYYY-MM-DD') !== moment(request.data!.workdayDate).format('YYYY-MM-DD')), request.data!] }, workdaysMonth: {...prev.workdaysMonth, data: { workdays: [...prev.workdaysMonth.data.workdays.filter(j => moment(j.workdayDate).format('YYYY-MM-DD') !== moment(request.data!.workdayDate).format('YYYY-MM-DD')), request.data!], pdfFile: prev.workdaysMonth.data.pdfFile } }}));
            setStateWorkday(request.data)
            toast.success("Le découchage a bien été modifié.");
        }
    }
    
    return (
        <TemplateWorkday title="Gestion des horaires" selectedSection={NavBarSection.HOME}>
            {
                authentification && authentification.payload.suspension ? (
                    <SuspensionInformation contactEmail={authentification.payload.suspension.contactEmail} />
                ) : (
                    workdayContext.workdaysWeek.loading || workdayContext.workdaysMonth.loading ?
                    <CenterPageLoader content="Récupération de vos journées" /> :
                    <>
                        <div className="h-4"></div>
                        <div className="py-2 px-4 w-full">
                            <WeekTableWorkdayInformations weekWorkdays={workdayContext.workdaysWeek.data} monthWorkdays={workdayContext.workdaysMonth.data.workdays} />
                            {
                                stateWorkday && stateWorkday.endHour && (
                                    <>
                                        <div className="h-2"></div>
                                        <p className="text-base text-left cursor-pointer underline text-[#232B35] dark:text-white" onClick={() => updateWorkday ? {} : cancelEndWorkday()} >Annuler la fin de la journée</p>
                                    </>
                                )
                            }
                        </div>
                        <div className="h-16"></div>
                        <div>
                            <div className="w-[70%] inline-block">
                                {
                                    stateWorkday ? (
                                        stateWorkday.endHour ? (
                                            stateWorkday.overnightRest ? (
                                                <MainButton label="Désactiver le découchage" fullWidth={true} onClick={() => updateOvernightRest(false)} isDisabled={updateWorkday} isLoading={updateWorkday} />
                                            ) : (
                                                <MainButton label="Activer le découchage" fullWidth={true} onClick={() => updateOvernightRest(true)} isDisabled={updateWorkday} isLoading={updateWorkday} />
                                            )
                                        ) : (
                                            <MainButton label="Terminer la journée" fullWidth={true} onClick={() => workdayContext.restPeriods.data ? endWorkday() : setAskRestPeriod(true)} isDisabled={updateWorkday} isLoading={updateWorkday} />
                                        )
                                    ) : (
                                        <MainButton label="Commencer la journée" fullWidth={true} onClick={() => startWorkday()} isDisabled={updateWorkday} isLoading={updateWorkday} />
                                    )
                                }
                            </div>
                            <div className="h-[40px]"></div>
                            <div className="w-[70%] inline-block">
                                <SecondaryButton label="Coupures automatisées" fullWidth={true} onClick={() => navigate('/dashboard/coupures')} isDisabled={false} isLoading={false} />
                            </div>
                        </div>
                        {
                            cancelEndWorkdayConfirmation && <CenterModal onCancel={() => setCancelEndWorkdayConfirmation(false)} size={{desktop: 'relative', mobile: 'relative'}}>
                                <div className="flex flex-col gap-4">
                                    <p>Êtes-vous sûr de vouloir annuler la fin de votre journée ?</p>
                                    <div className="flex justify-around gap-4">
                                        <SecondaryButton label="Non" onClick={() => setCancelEndWorkdayConfirmation(false)} isDisabled={false} isLoading={false} />
                                        <MainButton label="Oui" onClick={() => cancelEndWorkday()} isDisabled={false} isLoading={updateWorkday} />
                                    </div>
                                </div>
                            </CenterModal>
                        }
                        {
                            askRestPeriod && <CenterModal onCancel={() => setAskRestPeriod(false)} size={{desktop: 'relative', mobile: 'relative'}}>
                                <div className="flex flex-col gap-4">
                                    <p>Veuillez saisir le temps de votre coupure :</p>
                                    <div className="mt-4 flex flex-col gap-6">
                                        <div>
                                            <TimeInput value={restPeriodWithoutAutomatisationInput} isError={false} inputType="interactive" isDisabled={false} onChange={(e: any) => setRestPeriodWithoutAutomatisationInput(e.target.value)} />
                                        </div>
                                        <div className="flex justify-around gap-4">
                                            <SecondaryButton label="Annuler" onClick={() => setAskRestPeriod(false)} isDisabled={false} isLoading={false} />
                                            <MainButton label="Valider" onClick={() => endWorkday()} isDisabled={false} isLoading={false} />
                                        </div>
                                    </div>
                                </div>
                            </CenterModal>
                        }
                    </>
                )
            }
        </TemplateWorkday>
    )
}

const WeekTableWorkdayInformations: React.FC<{ weekWorkdays: Workday[], monthWorkdays: Workday[] }> = ({ weekWorkdays, monthWorkdays }) => {
    const totalMonthHours: number = monthWorkdays.reduce((acc, workday: Workday) => acc + workday.calculWorkTimeInSeconds(), 0);

    const weekDays: { day: number, name: string }[] = [{ day: 1, name: 'Lundi' }, { day: 2, name: 'Mardi' }, { day: 3, name: 'Mercredi' }, { day: 4, name: 'Jeudi' }, { day: 5, name: 'Vendredi' }, { day: 6, name: 'Samedi' }, { day: 0, name: 'Dimanche' }];
    const months: string[] = ['de janvier', 'de février', 'de mars', "d'avril", 'de mai', 'de juin', 'de juillet', "d'août", 'de septembre', "d'octobre", 'de novembre', 'de décembre'];

    return (
        <div className="bg-white dark:bg-[#141f30] dark:text-white px-4 py-2 border border-[#DADADA] dark:border-black rounded-lg">
            <table className="w-full text-left text-base">
                <tbody>
                    <tr>
                        <th>Jour</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>Coupure</th>
                    </tr>
                    <tr className="h-[6px]"></tr>
                    {
                        weekDays.map((weekDay: { day: number, name: string }, index: number) => {
                            const workday = weekWorkdays.find(j => j.workdayDate.getDay() === weekDay.day);
                            if ([0, 6].includes(weekDay.day) && !workday) return <tr key={index}></tr>

                            return (
                                <tr key={index}>
                                    <td>{weekDay.name}</td>
                                    <td>{workday ? moment(workday.startHour).format("HH:mm:ss") : ''}</td>
                                    <td>{workday && workday.endHour ? moment(workday.endHour).format('HH:mm:ss') : ''}</td>
                                    <td>{workday && workday.endHour ? moment(workday.restPeriod).format("HH:mm:ss") : ''}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <hr className="my-3" />
            <div className="flex justify-between text-base">
                <p>Heures du mois {months[new Date().getMonth()]}</p>
                <p>{ Workday.formatWorkTimeToString(totalMonthHours, false, { showHour: true, showMinute: true, showSecond: false }) }</p>
            </div>
        </div>
    )
}

export default WeekDashboardPage