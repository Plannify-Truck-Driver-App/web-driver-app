import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const DEACTIVATE_MAIL_PREFERENCE_URL: string = '/user/mails/preferences/deactivate'

export interface IDeactivateMailPreferenceRequest {
    mailTypeId: number
}

export interface IDeactivateMailPreferenceResponse {
    message: string,
    data: null
}

export async function deactivateMailPreferenceApi(request: IDeactivateMailPreferenceRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult: AxiosResponse = await axios.patch(DEACTIVATE_MAIL_PREFERENCE_URL, {
            mail_type_id: request.mailTypeId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IDeactivateMailPreferenceResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, deactivateMailPreferenceApi, request, context)
    }
}