import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const SEND_VERIFICATION_MAIL_URL: string = '/user/mails/send/verification'

export interface ISendVerificationMailRequest {
    email: string
}

export async function sendVerificationMailApi(request: ISendVerificationMailRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.post(SEND_VERIFICATION_MAIL_URL, {
            email: request.email
        }, { headers: { 'Content-Type': 'application/json' } })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, sendVerificationMailApi, request, context)
    }
}