import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const REACTIVATE_ACCOUNT_URL: string = '/user/reactivation'

export interface IReactivateAccountResponse {
    message: string,
    data: null
}

export async function reactivateAccountApi(request: null, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.patch(REACTIVATE_ACCOUNT_URL, null, { headers: { 'Authorization': `Bearer ${context.authentification.accessToken}` } })

        const response: IReactivateAccountResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, reactivateAccountApi, request, context)
    }
}