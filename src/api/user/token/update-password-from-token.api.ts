import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const UPDATE_PASSWORD_FROM_TOKEN_URL: string = '/user/token/{token}/reset-password'

export interface IUpdatePasswordFromTokenRequest {
    token: string;
    password: string;
}

export async function updatePasswordFromTokenApi(request: IUpdatePasswordFromTokenRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = UPDATE_PASSWORD_FROM_TOKEN_URL.replace("{token}", request.token);

        const axiosResult: AxiosResponse = await axios.patch(urlWithToken, {
            password: request.password
        }, { headers: { 'Content-Type': 'application/json' } })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, updatePasswordFromTokenApi, request, context)
    }
}