import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const VALIDITY_TOKEN_URL: string = '/user/token/{token}/status'

export interface IValidityTokenRequest {
    token: string;
    type: string;
}

export async function validityTokenApi(request: IValidityTokenRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = VALIDITY_TOKEN_URL.replace("{token}", request.token);

        const axiosResult: AxiosResponse = await axios.get(urlWithToken, {
            params: {
                type: request.type
            },
            headers: { 'Content-Type': 'application/json' }
        })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, validityTokenApi, request, context)
    }
}