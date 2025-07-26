import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const UPDATE_VERIFICATION_EMAIL_URL: string = '/user/update-unverified-email'

export interface IUpdateVerificationEmailRequest {
    oldEMail: string,
    newEmail: string
}

export async function updateVerificationEmailApi(request: IUpdateVerificationEmailRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.patch(UPDATE_VERIFICATION_EMAIL_URL, {
            old_email: request.oldEMail,
            new_email: request.newEmail
        }, { headers: { 'Content-Type': 'application/json' } })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, updateVerificationEmailApi, request, context)
    }
}