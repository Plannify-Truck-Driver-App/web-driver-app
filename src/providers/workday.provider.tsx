import { getWorkdayMonthApi } from "api/workday/get-workday-month.api";
import { getWorkdayWeekApi } from "api/workday/get-workday-week.api";
import { getPeriodPdfMonthApi } from "api/workday/get-period-pdf-month.api";
import { getRestPeriodsApi } from "api/workday/rest/get-rest-period.api";
import useAuthentification from "hooks/useAuthentification.hook";
import { Workday, PdfPeriod } from "models";
import { PdfWorkdayMonthly } from "models/pdf-workday-monthly.model";
import { RestPeriod } from "models/rest-period.model";
import { createContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface WorkdayProviderProps {
    workdayContext: {
        workdaysWeek: {
            data: Workday[];
            loading: boolean;
        };
        workdaysMonth: {
            data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null };
            loading: boolean;
        };
        workdaysLastMonth: {
            data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null };
            loading: boolean;
        };
        restPeriods: {
            data: RestPeriod[] | null;
            loading: boolean;
        };
        pdfPeriods: {
            data: PdfPeriod[];
            loading: boolean;
        };
    }
    setWorkdayContext: React.Dispatch<React.SetStateAction<{
        workdaysWeek: {
            data: Workday[];
            loading: boolean;
        };
        workdaysMonth: {
            data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null };
            loading: boolean;
        };
        workdaysLastMonth: {
            data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null };
            loading: boolean;
        };
        restPeriods: {
            data: RestPeriod[] | null;
            loading: boolean;
        };
        pdfPeriods: {
            data: PdfPeriod[];
            loading: boolean;
        };
    }>>
}

const WorkdayContext = createContext<WorkdayProviderProps>({ workdayContext: { workdaysWeek: { data: [], loading: true }, workdaysMonth: { data: { workdays: [], pdfFile: null }, loading: true }, workdaysLastMonth: { data: { workdays: [], pdfFile: null }, loading: true }, restPeriods: { data: null, loading: true }, pdfPeriods: { data: [], loading: true } }, setWorkdayContext: () => null });

export const WorkdayProvider = ({ children }: any) => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [workdayContext, setWorkdayContext] = useState<{ workdaysWeek: { data: Workday[], loading: boolean }, workdaysMonth: { data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null }, loading: boolean }, workdaysLastMonth: { data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null }, loading: boolean }, restPeriods: { data: RestPeriod[] | null, loading: boolean }, pdfPeriods: { data: PdfPeriod[], loading: boolean } }>({ workdaysWeek: { data: [], loading: true }, workdaysMonth: { data: { workdays: [], pdfFile: null }, loading: true }, workdaysLastMonth: { data: { workdays: [], pdfFile: null }, loading: true }, restPeriods: { data: null, loading: true }, pdfPeriods: { data: [], loading: true } });

    useEffect(() => {
        if (authentification) {
            // Si l'utilisateur n'est pas suspendu, on récupère les données des journées
            if (!authentification.payload.suspension) {
                getWorkdayContextData();
            }
            // Sinon, on récupère uniquement les données des PDF 
            else {
                getPdfPeriods();
            }
        }
    }, [authentification])

    const getWorkdayContextData = async () => {
        const response1: { status: boolean } = await getWorkdaysCurrentWeek();
        if (!response1.status) return;

        const response2: { status: boolean } = await getWorkdaysCurrentMonth();
        if (!response2.status) return;

        const response3: { status: boolean } = await getWorkdaysLastMonth();
        if (!response3.status) return;

        const response4: { status: boolean } = await getRestPeriods();
        if (!response4.status) return;

        await getPdfPeriods();
    }

    const getWorkdaysCurrentWeek = async (): Promise<{ status: boolean }> => {
        setWorkdayContext(prev => ({ ...prev, workdaysWeek: { ...prev.workdaysWeek, loading: true } }))

        const response = await getWorkdayWeekApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success && response.data !== null)
            setWorkdayContext(prev => ({ ...prev, workdaysWeek: { ...prev.workdaysWeek, data: response.data! } }))

        setWorkdayContext(prev => ({ ...prev, workdaysWeek: { ...prev.workdaysWeek, loading: false } }))

        return { status: response.success }
    }

    const getWorkdaysCurrentMonth = async (): Promise<{ status: boolean }> => {
        const date: Date = new Date();
        const month: number = date.getMonth() + 1;
        const year: number = date.getFullYear();

        setWorkdayContext(prev => ({ ...prev, workdaysMonth: { ...prev.workdaysMonth, loading: true } }))

        const response = await getWorkdayMonthApi({ month: month, year: year }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success && response.data !== null)
            setWorkdayContext(prev => ({ ...prev, workdaysMonth: { ...prev.workdaysMonth, data: { workdays: response.data!.workdays, pdfFile: response.data!.pdfFile } } }))

        setWorkdayContext(prev => ({ ...prev, workdaysMonth: { ...prev.workdaysMonth, loading: false } }))

        return { status: response.success }
    }

    const getWorkdaysLastMonth = async (): Promise<{ status: boolean }> => {
        const today: Date = new Date();
        const lastMonth: Date = new Date(today.getFullYear(), today.getMonth() - 1, Math.min(today.getDate(), new Date(today.getFullYear(), today.getMonth(), 0).getDate()));

        const month: number = lastMonth.getMonth() + 1;
        const year: number = lastMonth.getFullYear();

        setWorkdayContext(prev => ({ ...prev, workdaysLastMonth: { ...prev.workdaysLastMonth, loading: true } }))

        const response = await getWorkdayMonthApi({ month: month, year: year }, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success && response.data !== null)
            setWorkdayContext(prev => ({ ...prev, workdaysLastMonth: { ...prev.workdaysLastMonth, data: { workdays: response.data!.workdays, pdfFile: response.data!.pdfFile } } }))

        setWorkdayContext(prev => ({ ...prev, workdaysLastMonth: { ...prev.workdaysLastMonth, loading: false } }))

        return { status: response.success }
    }

    const getRestPeriods = async (): Promise<{ status: boolean }> => {
        setWorkdayContext(prev => ({ ...prev, restPeriods: { ...prev.restPeriods, loading: true } }))

        const response = await getRestPeriodsApi(null, { navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success)
            setWorkdayContext(prev => ({ ...prev, restPeriods: { ...prev.restPeriods, data: response.data } }))

        setWorkdayContext(prev => ({ ...prev, restPeriods: { ...prev.restPeriods, loading: false } }))

        return { status: response.success }
    }
    
    const getPdfPeriods = async (): Promise<{ status: boolean }> => {
        setWorkdayContext(prev => ({ ...prev, pdfPeriods: { ...prev.pdfPeriods, loading: true } }))

        const response = await getPeriodPdfMonthApi({ navigation: navigate, authentification: authentification, setAuthentification: setAuthentification });

        if (response.success && response.data !== null)
            setWorkdayContext(prev => ({ ...prev, pdfPeriods: { ...prev.pdfPeriods, data: response.data! } }))

        setWorkdayContext(prev => ({ ...prev, pdfPeriods: { ...prev.pdfPeriods, loading: false } }))

        return { status: response.success }
    }

    return (
        <WorkdayContext.Provider value={{ workdayContext: workdayContext, setWorkdayContext: setWorkdayContext }}>
            {children}
        </WorkdayContext.Provider>
    )
}

export default WorkdayContext;