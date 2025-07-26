import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const VERIFICATION_ACCOUNT_URL: string = '/user/token/{token}/account-verification'

export interface IVerificationAccountRequest {
    token: string;
}

export interface IVerificationAccountResponse {
    message: string,
    data: {
        access_token: string,
        refresh_token: string
    } | null
}

export async function verificationAccountApi(request: IVerificationAccountRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { accessToken: string, refreshToken: string } | null }> {
    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = VERIFICATION_ACCOUNT_URL.replace("{token}", request.token);

        const axiosResult: AxiosResponse = await axios.patch(urlWithToken, null, {})

        const response: IVerificationAccountResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data ? { accessToken: response.data.access_token, refreshToken: response.data.refresh_token } : null }
    } catch (error: any) {
        return await errorApi<{ accessToken: string, refreshToken: string }>(error, verificationAccountApi, request, context)
    }
}