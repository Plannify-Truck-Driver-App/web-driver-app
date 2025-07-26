import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const ACTIVATE_MAIL_PREFERENCE_URL: string = '/user/mails/preferences/activate'

export interface IActivateMailPreferenceRequest {
    mailTypeId: number
}

export interface IActivateMailPreferenceResponse {
    message: string,
    data: null
}

export async function activateMailPreferenceApi(request: IActivateMailPreferenceRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult: AxiosResponse = await axios.patch(ACTIVATE_MAIL_PREFERENCE_URL, {
            mail_type_id: request.mailTypeId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IActivateMailPreferenceResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, activateMailPreferenceApi, request, context)
    }
}