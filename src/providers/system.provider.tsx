import { getAppUpdatesApi } from "api/help/get-app-updates.api";
import { getMaintenancesApi } from "api/help/get-maintenances.api";
import useAuthentification from "hooks/useAuthentification.hook";
import { Maintenance, Update } from "models";
import { createContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface SystemProviderProps {
    systemContext: {
        updates: {
            data: Update[];
            loading: boolean;
        },
        maintenances: {
            data: Maintenance[];
            loading: boolean;
        }
    },
    setSystemContext: React.Dispatch<React.SetStateAction<{
        updates: {
            data: Update[];
            loading: boolean;
        },
        maintenances: {
            data: Maintenance[];
            loading: boolean;
        }
    }>>
}

const SystemContext = createContext<SystemProviderProps>({ systemContext: { updates: { data: [], loading: true }, maintenances: { data: [], loading: true }}, setSystemContext: () => null });

export const SystemProvider = ({ children }: any) => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate: NavigateFunction = useNavigate();

    const [systemContext, setSystemContext] = useState<{ updates: { data: Update[], loading: boolean }, maintenances: { data: Maintenance[], loading: boolean } }>({ updates: { data: [], loading: true }, maintenances: { data: [], loading: true } });

    useEffect(() => {
        if (authentification) {
            getSystemContextData();
        }
    }, [authentification])

    const getSystemContextData = async () => {
        const response1: { status: boolean } = await getUpdates();
        if (!response1.status) return;

        getMaintenances();
    }

    const getUpdates = async (): Promise<{ status: boolean }> => {
        setSystemContext(prev => ({ ...prev, updates: { ...prev.updates, loading: true } }))

        const response = await getAppUpdatesApi();

        if (response.success && response.data !== null)
            setSystemContext(prev => ({ ...prev, updates: { ...prev.updates, data: response.data! } }))

        setSystemContext(prev => ({ ...prev, updates: { ...prev.updates, loading: false } }))

        return { status: response.success }
    }

    const getMaintenances = async (): Promise<{ status: boolean }> => {
        setSystemContext(prev => ({ ...prev, maintenances: { ...prev.maintenances, loading: true } }))

        const response = await getMaintenancesApi();

        if (response.success && response.data !== null)
            setSystemContext(prev => ({ ...prev, maintenances: { ...prev.maintenances, data: response.data! } }))

        setSystemContext(prev => ({ ...prev, maintenances: { ...prev.maintenances, loading: false } }))

        return { status: response.success }
    }

    return (
        <SystemContext.Provider value={{ systemContext, setSystemContext }}>
            {children}
        </SystemContext.Provider>
    )
}

export default SystemContext;