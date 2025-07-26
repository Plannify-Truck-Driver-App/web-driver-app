import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const UPDATE_EMAIL_URL: string = '/user/email'

export interface IUpdateEmailRequest {
    email: string
}

export interface IUpdateEmailResponse {
    message: string,
    data: null
}

export async function updateEmailApi(request: IUpdateEmailRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.patch(UPDATE_EMAIL_URL, {
            email: request.email
        }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.authentification.accessToken}` } })

        const response: IUpdateEmailResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, updateEmailApi, request, context)
    }
}