import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const GET_MAIL_PREFERENCES_URL: string = '/user/mails/preferences'

export interface IGetAllTypesMailsResponse {
    message: string,
    data: { binary_preference: number }
}

export async function getMailPreferencesApi(context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { binary_preference: number } | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.get(GET_MAIL_PREFERENCES_URL,
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.authentification.accessToken}` } }
        )

        const response: IGetAllTypesMailsResponse = axiosResult.data

        return { success: true, message: response.message, data: { binary_preference: response.data.binary_preference }}
    } catch (error: any) {
        return await errorApi<{ binary_preference: number }>(error, getMailPreferencesApi, null, context)
    }
}