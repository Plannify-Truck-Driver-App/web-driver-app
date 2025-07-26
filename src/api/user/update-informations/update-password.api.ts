import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const UPDATE_PASSWORD_URL: string = '/user/password'

export interface IUpdatePasswordRequest {
    oldPassword: string,
    newPassword: string
}

export interface IUpdatePasswordResponse {
    message: string,
    data: null
}

export async function updatePasswordApi(request: IUpdatePasswordRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.patch(UPDATE_PASSWORD_URL, {
            old_password: request.oldPassword,
            new_password: request.newPassword
        }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.authentification.accessToken}` } })

        const response: IUpdatePasswordResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, updatePasswordApi, request, context)
    }
}