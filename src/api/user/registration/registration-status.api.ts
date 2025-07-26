import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const INSCRIPTION_STATE_URL: string = '/user/registration/status'

export async function registrationStatusApi(context: IContexteApi | null): Promise<{ success: boolean, message: string, data: any | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.get(INSCRIPTION_STATE_URL, { headers: { 'Content-Type': 'application/json' } })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data }
    } catch (error: any) {
        return await errorApi<any>(error, registrationStatusApi, null, context)
    }   
}