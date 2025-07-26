import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const SEND_FORGOT_PASSWORD_MAIL_URL: string = '/user/mails/send/reset-password'

export interface ISendForgotPasswordMailRequest {
    email: string
}

export async function sendForgotPasswordMailApi(request: ISendForgotPasswordMailRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.post(SEND_FORGOT_PASSWORD_MAIL_URL, {
            email: request.email
        }, { headers: { 'Content-Type': 'application/json' } })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, sendForgotPasswordMailApi, request, context)
    }
}