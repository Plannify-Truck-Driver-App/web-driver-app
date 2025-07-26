import { deleteRestPeriodsApi } from "api/workday/rest/delete-rest-period.api";
import { updateRestPeriodsApi } from "api/workday/rest/update-rest-period.api";
import { MainButton, SecondaryButton } from "components/buttons";
import Information from "components/informations/information.component";
import SuspensionInformation from "components/informations/suspension.component";
import { TextInput } from "components/inputs";
import TimeInput from "components/inputs/time.component";
import { CenterPageLoader } from "components/loaders";
import CenterModal from "components/modals/center-modal.component";
import TemplateWorkday from "components/templates/template-workday.component";
import useAuthentification from "hooks/useAuthentification.hook";
import useWorkday from "hooks/useWorkday.hook";
import { Wrench } from "lucide-react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { RestPeriod } from "models/rest-period.model";
import moment from "moment";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RestPeriodsPage: React.FC = () => {
    const { authentification, setAuthentification } = useAuthentification();
    const { workdayContext, setWorkdayContext } = useWorkday();

    const navigate: NavigateFunction = useNavigate();

    const dateString: string = moment(new Date()).format("YYYY-MM-DD");

    const [actionRestPeriod, setActionRestPeriod] = useState<'view' | 'add' | 'delete'>('view');
    const [loadingDeleteRestPeriod, setLoadingDeleteRestPeriod] = useState<boolean>(false);

    const onAddRestPeriods = async (restPeriods: {start: string, end: string, rest: string}[]) => {
        setWorkdayContext(prev => ({...prev, restPeriods: {...prev.restPeriods, data: restPeriods.map(restPeriod => new RestPeriod(new Date(dateString + ' ' + restPeriod.start), new Date(dateString + ' ' + restPeriod.end), new Date(dateString + ' ' + restPeriod.rest))) }}))
        setActionRestPeriod('view')
    }

    const onDeleteRestPeriod = async () => {
        setLoadingDeleteRestPeriod(true)
        const response = await deleteRestPeriodsApi(null, { navigation: navigate, authentification, setAuthentification })
        setLoadingDeleteRestPeriod(false)

        if (response.success) {
            setWorkdayContext(prev => ({...prev, restPeriods: {...prev.restPeriods, data: null }}))
            setActionRestPeriod('view')
        }
    }

    return (
        <TemplateWorkday title="Coupures automatisées" onClickReturn={() => actionRestPeriod === 'view' ? navigate('/dashboard/semaine') : setActionRestPeriod('view')} selectedSection={NavBarSection.HOME}>
            {
                authentification && authentification.payload.suspension ? (
                    <SuspensionInformation contactEmail={authentification.payload.suspension.contactEmail} />
                ) : (
                    workdayContext.workdaysWeek.loading || workdayContext.workdaysMonth.loading ?
                    <CenterPageLoader content="Récupération de vos coupures" /> : (
                        actionRestPeriod === 'view' ? (
                            <>
                                <ViewRestPeriods restPeriods={workdayContext.restPeriods.data} />
                                {
                                    workdayContext.restPeriods.data && workdayContext.restPeriods.data.length > 0 ? (
                                        <div className="fixed right-5 bottom-[100px] flex flex-row items-center gap-2 py-2 px-4 bg-[#1887a3] text-white rounded-lg cursor-pointer" onClick={() => setActionRestPeriod('delete')}>
                                            <p>Supprimer</p>
                                            <Wrench />
                                        </div>
                                    ) : (
                                        <div className="fixed right-5 bottom-[100px] flex flex-row items-center gap-2 py-2 px-4 bg-[#1887a3] text-white rounded-lg cursor-pointer" onClick={() => setActionRestPeriod('add')}>
                                            <p>Ajouter</p>
                                            <Wrench />
                                        </div>
                                    )
                                }
                            </>
                        ) : (
                            actionRestPeriod === 'add' || !workdayContext.restPeriods.data ? (
                                <>
                                    <AddRestPeriods updateRestPeriod={onAddRestPeriods} />
                                </>
                            ) : (
                                <CenterModal onCancel={() => onDeleteRestPeriod()} size={{desktop: 'relative', mobile: 'relative'}}>
                                    <div className="flex flex-col gap-4">
                                        <p>Êtes-vous sûr de vouloir supprimer la configuration de vos coupures ?</p>
                                        <div className="flex justify-around gap-4">
                                            <SecondaryButton label="Non" onClick={() => setActionRestPeriod('view')} isDisabled={false} isLoading={false} />
                                            <MainButton label="Oui" onClick={() => onDeleteRestPeriod()} isDisabled={false} isLoading={loadingDeleteRestPeriod} />
                                        </div>
                                    </div>
                                </CenterModal>
                            )
                        )
                    )
                )
            }
            <div className="h-40"></div>
        </TemplateWorkday>
    )
}

const RestPeriodsTable: React.FC<{ restPeriods: RestPeriod[] }> = ({ restPeriods }) => {

    return (
        <div className="bg-white dark:bg-[#141f30] dark:text-white px-4 py-2 border border-[#DADADA] dark:border-black rounded-lg">
            <table className="w-full text-left text-base">
                <tbody>
                    <tr>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>Coupure</th>
                    </tr>
                    <tr className="h-[6px]"></tr>
                    {
                        restPeriods.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center dark:text-white" >Aucune coupure enregistrée</td>
                            </tr>
                        ) : (
                            restPeriods.map((restPeriod: RestPeriod, index: number) => {

                                return (
                                    <tr key={index}>
                                        <td>{moment(restPeriod.startInterval).format("HH:mm:ss")}</td>
                                        <td>{moment(restPeriod.endInterval).format("HH:mm:ss")}</td>
                                        <td>{moment(restPeriod.restTime).format("HH:mm:ss")}</td>
                                    </tr>
                                )
                            })
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

interface ViewRestPeriodsProps {
    restPeriods: RestPeriod[] | null;
}

const ViewRestPeriods: React.FC<ViewRestPeriodsProps> = ({ restPeriods }) => {
    const currentDate: string = moment(new Date()).format("YYYY-MM-DD");
    const restPeriodExample: RestPeriod | undefined = restPeriods && restPeriods.length > 0 ? restPeriods.find(restPeriod => restPeriod.startInterval.getTime() <= new Date(currentDate + " 11:00:00").getTime() && restPeriod.endInterval.getTime() >= new Date(currentDate + " 11:00:00").getTime()) : undefined;

    const [showMoreInformation, setShowMoreInformation] = useState<boolean>(false);

    return (
        showMoreInformation ? (
            <div className="text-left px-4 dark:text-white">
                <p>Une coupure possède trois temps : <span className="border border-blue-600 bg-blue-100 rounded px-1 whitespace-nowrap text-black">un temps de début</span>, <span className="border border-blue-600 bg-blue-100 rounded px-1 whitespace-nowrap text-black">un temps de fin</span> et <span className="border border-blue-600 bg-blue-100 rounded px-1 whitespace-nowrap text-black">un temps de coupure</span>.</p>
                <p>Chaque temps est représenté au format <span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap mr-1 text-black">Heure</span>:<span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap mx-1 text-black">Minute</span>:<span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap ml-1 text-black">Seconde</span>.</p>
                <p className="mt-10">Exemple :</p>
                <RestPeriodsTable restPeriods={[new RestPeriod(new Date(currentDate + " 00:00:00"), new Date(currentDate + " 05:29:59"), new Date(currentDate + " 00:15:00")), new RestPeriod(new Date(currentDate + " 05:30:00"), new Date(currentDate + " 07:59:59"), new Date(currentDate + " 00:45:00")), new RestPeriod(new Date(currentDate + " 08:00:00"), new Date(currentDate + " 11:59:59"), new Date(currentDate + " 01:00:00")), new RestPeriod(new Date(currentDate + " 12:00:00"), new Date(currentDate + " 23:59:59"), new Date(currentDate + " 01:30:00"))]} />
                <p>Ici nous avons <b>4</b> coupures.</p>
                <p className="mt-10">Une coupure est assignée à la fin d'une journée à partir <span className="border border-green-600 bg-green-100 rounded px-1 whitespace-nowrap text-black">du temps travaillé</span> (<span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap text-black">fin de la journée</span> - <span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap text-black">début de la journée</span>). L'attribution d'une coupure est la suivante :<br/><span className="border border-blue-600 bg-blue-100 rounded px-1 whitespace-nowrap text-black">temps de début</span> ≤ <span className="border border-green-600 bg-green-100 rounded px-1 whitespace-nowrap text-black">temps travaillé</span> ≤ <span className="border border-blue-600 bg-blue-100 rounded px-1 whitespace-nowrap text-black">temps de fin</span> = <span className="border border-blue-600 bg-blue-100 rounded px-1 whitespace-nowrap text-black">temps de coupure</span></p>
                <div className="h-40"></div>
            </div>
        ) : (
            !restPeriods || restPeriods.length === 0 ? (
                <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2 px-4 dark:text-white">
                    <div className="flex justify-center">
                        <div className="w-[70%]">
                            <img src="/images/undraw_chilling.svg" alt="Aucune coupure" />
                        </div>
                    </div>
                    <p className="my-6">Aucune coupure enregistrée.</p>
                    <p className="underline text-blue-500 cursor-pointer" onClick={() => setShowMoreInformation(true)} >Qu'est-ce qu'une coupure automatisée ?</p>
                </div>
            ) : (
                <div className="py-2 w-full dark:text-white">
                    <div className="h-2"></div>
                    <div className="px-4">
                        <RestPeriodsTable restPeriods={restPeriods} />
                        <p className="underline text-blue-500 cursor-pointer mt-6" onClick={() => setShowMoreInformation(true)} >Qu'est-ce qu'une coupure automatisée ?</p>
                    </div>
                    <div className="h-10"></div>
                    <Information borderColor={{ light: "F9CC00", dark: "F9CC00" }} backgroundColor={{ light: "FEFEFC", dark: "141f30" }} emoji="💡">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">Information</p>
                        <p>Les coupures vous permettent de calculer <span className="underline">précisément</span> et <span className="underline">automatiquement</span> vos pauses en fonction de votre temps total de travail à la fin de chacune de vos journées.</p>
                    </Information>
                    {
                        restPeriodExample && (
                            <>
                                <div className="h-2"></div>
                                <Information borderColor={{ light: "667685", dark: "667685" }} backgroundColor={{ light: "F3F6F9", dark: "141f30" }} emoji="⚙️">
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">Exemple</p>
                                    <p>Dans votre situation, si vous réalisez une journée débutant à 06:00:00 et finissant à 17:00:00, alors vous aurez automatiquement une pause de <strong>{ moment(restPeriodExample.restTime).format("HH:mm:ss") }</strong>.</p>
                                    <p>Ici il y a <span className="underline">11 heures de travail</span>, c'est donc la coupure suivante qui s'est appliquée :</p>
                                    <div className="text-center">
                                        <span className="bg-white dark:bg-[#667685] p-2 my-1 border rounded-lg border-[#DADADA] inline-block">{moment(restPeriodExample.startInterval).format('HH:mm:ss') + ' - ' + moment(restPeriodExample.endInterval).format('HH:mm:ss') + ' -> ' + moment(restPeriodExample.restTime).format('HH:mm:ss')}</span>
                                    </div>
                                </Information>
                            </>
                        )
                    }
                </div>
            )
        )
    )
}

interface AddRestPeriodsProps {
    updateRestPeriod: (restPeriods: {start: string, end: string, rest: string}[]) => void;
}

const AddRestPeriods: React.FC<AddRestPeriodsProps> = ({ updateRestPeriod }) => {
    const {authentification, setAuthentification} = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [restPeriods, setRestPeriods] = useState<{start: string, end: string, rest: string}[] | undefined>(undefined);
    const [restPeriodInputs, setRestPeriodInputs] = useState<{start: string, end: string, rest: string}>({start: '', end: '', rest: ''});
    const [amountRestPeriods, setAmountRestPeriods] = useState<string>('');

    const [inputsError, setInputsError] = useState<{start: boolean, end: boolean, rest: boolean}>({start: false, end: false, rest: false})
    const [loading, setLoading] = useState<boolean>(false);

    const dateString: string = moment(new Date()).format("YYYY-MM-DD");

    const configureRestPeriodList = () => {
        if (amountRestPeriods !== '') {
            const amount: number = parseInt(amountRestPeriods);

            if (amount > 0) {
                setRestPeriods([]);
            }
        }
    }

    const isHourValid = (hour: string): boolean => {
        return /^([01_][0-9_]|2[0-3_]):([0-5_][0-9_])(:([0-5_][0-9_]))?$/.test(hour) || hour.trim().length === 0
    }

    const addRestPeriodInTable = () => {
        if (restPeriods === undefined) return

        if (restPeriodInputs.start === '') {
            setInputsError(prev => ({...prev, start: true}))
        }
        if (restPeriodInputs.end === '') {
            setInputsError(prev => ({...prev, end: true}))
        }
        if (restPeriodInputs.rest === '') {
            setInputsError(prev => ({...prev, rest: true}))
        }

        if (restPeriods.length > 0) {
            const dateLastEndPeriod: Date = new Date(dateString + ' ' + restPeriods[restPeriods.length - 1].end)
            dateLastEndPeriod.setSeconds(dateLastEndPeriod.getSeconds() + 1);
            
            if (moment(dateLastEndPeriod).format("HH:mm:ss") !== restPeriodInputs.start) {
                toast.warning("Les temps de début doivent avoir 1 seconde de plus que le temps de fin précédant.")
                setInputsError(prev => ({...prev, start: true}));
                return
            }
        }

        if (restPeriods.length === 0 && restPeriodInputs.start !== '00:00:00') {
            toast.warning("Le temps de début doit être de 00:00:00");
            setInputsError(prev => ({...prev, start: true}));
            return
        }

        if (restPeriods.length === parseInt(amountRestPeriods) - 1 && restPeriodInputs.end !== "23:59:59") {
            toast.warning("Le temps de fin doit être de 23:59:59")
            setInputsError(prev => ({...prev, end: true}));
            return
        }

        const dateEndPeriod: Date = new Date(dateString + ' ' + restPeriodInputs.end)
        dateEndPeriod.setSeconds(dateEndPeriod.getSeconds() + 1);

        if (new Date(dateString + ' ' + restPeriodInputs.start) > new Date(dateString + ' ' + restPeriodInputs.end)) {
            toast.warning("Le temps de fin ne peut pas être inférieur au temps de début.")
            setInputsError(prev => ({...prev, end: true}));
            return
        }

        if (inputsError.start || inputsError.end || inputsError.rest) {
            toast.warning("Veuillez compléter correctement tous les champs de saisie.");
            return
        }

        const restPeriodsLocal = [...restPeriods, {start: restPeriodInputs.start, end: restPeriodInputs.end, rest: restPeriodInputs.rest}];

        setRestPeriods(prev => prev === undefined ? undefined : ([...prev, {start: restPeriodInputs.start, end: restPeriodInputs.end, rest: restPeriodInputs.rest}]))

        if (restPeriodsLocal.length === parseInt(amountRestPeriods)) {
            addRestPeriods(restPeriodsLocal)
        } else {
            setRestPeriodInputs({start: moment(dateEndPeriod).format('HH:mm:ss'), end: '', rest: ''})
        }
    }

    const addRestPeriods = async (restPeriodsLocal: {start: string, end: string, rest: string}[]) => {
        if (restPeriodsLocal.length === 0) {
            toast.warning("Aucune coupure n'a été ajoutée.")
            return
        }

        if (restPeriodsLocal[0].start !== '00:00:00') {
            toast.warning("La première coupure doit débuter à 00:00:00");
            return
        }
        if (restPeriodsLocal[restPeriodsLocal.length - 1].end !== '23:59:59') {
            toast.warning("La dernière coupure doit se terminer à 23:59:59");
            return
        }

        for (let i = 0; i < restPeriodsLocal.length; i++) {
            if (i < restPeriodsLocal.length - 1 && restPeriodsLocal[i+1].start !== '00:00:00' && restPeriodsLocal[i].end !== '23:59:59') {
                const dateLastStartPeriod: Date = new Date(dateString + ' ' + restPeriodsLocal[i+1].start)
                dateLastStartPeriod.setSeconds(dateLastStartPeriod.getSeconds() - 1);

                if (moment(dateLastStartPeriod).format('HH:mm:ss') !== restPeriodsLocal[i].end) {
                    toast.warning(`La borne de fin de la coupure ${i + 1} doit avoir une seconde de moins que la borne de début de la coupure suivante. La borne de début de la coupure suivante pourrait être '${ moment(dateLastStartPeriod).format('HH:mm:ss') }'.`)
                    return
                }
            }

            for (let j = i + 1; j < restPeriodsLocal.length; j++) {
                // Cas : fin 1 >= début 2
                if (new Date(dateString + ' ' + restPeriodsLocal[i].end) >= new Date(dateString + ' ' + restPeriodsLocal[j].start)) {
                    toast.warning(`La borne de fin de la coupure ${i + 1} ne peut pas être supérieur ou égale à la borne de début de la coupure ${j + 1}.` );
                    return
                }
            }
        }

        setLoading(true);
        const response = await updateRestPeriodsApi({ restPeriods: restPeriodsLocal.map(rest => ({ startInterval: rest.start, endInterval: rest.end, restTime: rest.rest })) }, { navigation: navigate, authentification, setAuthentification });
        setLoading(false);

        if (response.success) {
            updateRestPeriod(restPeriodsLocal);
            toast.success("La configuration de vos coupures a bien été créée !");
        }
    }

    const onPreviousPage = () => {
        if (restPeriods === undefined) return

        setRestPeriodInputs({start: restPeriods[restPeriods.length - 1].start, end: restPeriods[restPeriods.length - 1].end, rest: restPeriods[restPeriods.length - 1].rest})
        setRestPeriods(restPeriods.slice(0, restPeriods.length - 1));
    }

    useEffect(() => {
        setInputsError({start: !isHourValid(restPeriodInputs.start), end: !isHourValid(restPeriodInputs.end), rest: !isHourValid(restPeriodInputs.rest)})
    }, [restPeriodInputs.start, restPeriodInputs.end, restPeriodInputs.rest])

    return (
        <div className="text-left px-4 dark:text-white">
            {
                restPeriods === undefined ? (
                    <div className="absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2 px-4">
                        <p className="text-lg">Pour commencer, renseignez le nombre de coupures que vous avez :</p>
                        <div className="flex flex-col items-center gap-6 mt-4">
                            <div className="w-[200px]">
                                <TextInput type='tel' label="Nombre de coupure" placeholder="Nombre de coupures" value={amountRestPeriods} onChange={(e: any) => setAmountRestPeriods(e.target.value)} isError={false} onEnterPress={() => configureRestPeriodList()} />
                            </div>
                            <div>
                                <MainButton label={amountRestPeriods !== '' && parseInt(amountRestPeriods) > 1 ? "Configurer les coupures" : "Configurer la coupure"} isDisabled={amountRestPeriods === ''} isLoading={false} onClick={() => configureRestPeriodList()} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <RestPeriodsTable restPeriods={restPeriods.map(rest => new RestPeriod(new Date(dateString + ' ' + rest.start), new Date(dateString + ' ' + rest.end), new Date(dateString + ' ' + rest.rest)))} />
                        {
                            parseInt(amountRestPeriods) === 1 ? (
                                <div className="mt-6">
                                    <p className="text-lg"><strong>Etape 1/1</strong><br/>Votre seule coupure débute à un temps de travail nul <span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap text-black">00:00:00</span> et se termine à un temps de travail maximal <span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap text-black">23:59:59</span>. Saisissez le temps de coupure associé :</p>
                                    <div className="flex flex-col items-center gap-6 mt-4">
                                        <div className="flex flex-row gap-4">
                                            <div>
                                                <p>Début</p>
                                                <TimeInput value="00:00:00" isError={inputsError.start} inputType={'keyboard'} isDisabled={true} onChange={() => {}} />
                                            </div>
                                            <div>
                                                <p>Fin</p>
                                                <TimeInput value="23:59:59" isError={inputsError.end} inputType={'keyboard'}isDisabled={true}  onChange={() => {}} />
                                            </div>
                                            <div>
                                                <p>Coupure</p>
                                                <TimeInput value={restPeriodInputs.rest} isError={inputsError.rest} inputType={'keyboard'} onChange={(e: any) => setRestPeriodInputs(prev => ({ start: '00:00:00', end: '23:59:59', rest: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div>
                                            <MainButton label="Créer la coupure" isDisabled={restPeriodInputs.rest === ''} isLoading={loading} onClick={() => addRestPeriodInTable()} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                restPeriods.length === 0 ? (
                                    <div className="mt-6">
                                        <p className="text-lg"><strong>Etape {restPeriods.length + 1}/{parseInt(amountRestPeriods)}</strong><br/>Votre première coupure débute à un temps de travail nul <span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap text-black">00:00:00</span>. Saisissez le temps de fin et le temps de coupure associé :</p>
                                        <div className="flex flex-col items-center gap-6 mt-4">
                                            <div className="flex flex-row gap-4">
                                                <div>
                                                    <p>Début</p>
                                                    <TimeInput value="00:00:00" isError={inputsError.start} inputType={'keyboard'} isDisabled={true} onChange={() => {}} />
                                                </div>
                                                <div>
                                                    <p>Fin</p>
                                                    <TimeInput value={restPeriodInputs.end} isError={inputsError.end} inputType={'keyboard'} onChange={(e: any) => setRestPeriodInputs(prev => ({ start: '00:00:00', end: e.target.value, rest: prev.rest }))} />
                                                </div>
                                                <div>
                                                    <p>Coupure</p>
                                                    <TimeInput value={restPeriodInputs.rest} isError={inputsError.rest} inputType={'keyboard'} onChange={(e: any) => setRestPeriodInputs(prev => ({ start: '00:00:00', end: prev.end, rest: e.target.value }))} />
                                                </div>
                                            </div>
                                            <div>
                                                <MainButton label="Coupure suivante" isDisabled={restPeriodInputs.end === '' || restPeriodInputs.rest === ''} isLoading={false} onClick={() => addRestPeriodInTable()} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    restPeriods.length === parseInt(amountRestPeriods) - 1 ? (
                                        <div className="mt-6">
                                            <p className="text-lg"><strong>Etape {restPeriods.length + 1}/{parseInt(amountRestPeriods)}</strong><br/>Votre dernière coupure termine à un temps de travail maximal <span className="border border-gray-600 bg-gray-100 rounded px-1 whitespace-nowrap text-black">23:59:59</span>. Saisissez le temps de coupure associé :</p>
                                            <div className="flex flex-col items-center gap-6 mt-4">
                                                <div className="flex flex-row gap-4">
                                                    <div>
                                                        <p>Début</p>
                                                        <TimeInput value={restPeriodInputs.start} isError={inputsError.start} inputType={'keyboard'} isDisabled={true} onChange={() => {}} />
                                                    </div>
                                                    <div>
                                                        <p>Fin</p>
                                                        <TimeInput value="23:59:59" isError={inputsError.end} inputType={'keyboard'} isDisabled={true} onChange={() => {}} />
                                                    </div>
                                                    <div>
                                                        <p>Coupure</p>
                                                        <TimeInput value={restPeriodInputs.rest} isError={inputsError.rest} inputType={'keyboard'} onChange={(e: any) => setRestPeriodInputs(prev => ({...prev, end: '23:59:59', rest: e.target.value }))} />
                                                    </div>
                                                </div>
                                                <div className="w-full flex flex-row gap-2 justify-around">
                                                    <div>
                                                        <SecondaryButton label="Précédent" isDisabled={false} isLoading={false} onClick={() => onPreviousPage()} />
                                                    </div>
                                                    <div>
                                                        <MainButton label="Ajouter les coupures" isDisabled={restPeriodInputs.end === '' || restPeriodInputs.rest === ''} isLoading={loading} onClick={() => addRestPeriodInTable()} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6">
                                            <p className="text-lg"><strong>Etape {restPeriods.length + 1}/{parseInt(amountRestPeriods)}</strong><br/>Saisissez le temps de fin et le temps de coupure associé :</p>
                                            <div className="flex flex-col items-center gap-6 mt-4">
                                                <div className="flex flex-row gap-4">
                                                    <div>
                                                        <p>Début</p>
                                                        <TimeInput value={restPeriodInputs.start} isError={inputsError.start} inputType={'keyboard'} isDisabled={true} onChange={() => {}} />
                                                    </div>
                                                    <div>
                                                        <p>Fin</p>
                                                        <TimeInput value={restPeriodInputs.end} isError={inputsError.end} inputType={'keyboard'} onChange={(e: any) => setRestPeriodInputs(prev => ({...prev, end: e.target.value }))} />
                                                    </div>
                                                    <div>
                                                        <p>Coupure</p>
                                                        <TimeInput value={restPeriodInputs.rest} isError={inputsError.rest} inputType={'keyboard'} onChange={(e: any) => setRestPeriodInputs(prev => ({...prev, rest: e.target.value }))} />
                                                    </div>
                                                </div>
                                                <div className="w-full flex flex-row gap-2 justify-around">
                                                    <div>
                                                        <SecondaryButton label="Précédent" isDisabled={false} isLoading={false} onClick={() => onPreviousPage()} />
                                                    </div>
                                                    <div>
                                                        <MainButton label="Suivant" isDisabled={restPeriodInputs.end === '' || restPeriodInputs.rest === ''} isLoading={false} onClick={() => addRestPeriodInTable()} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default RestPeriodsPage;