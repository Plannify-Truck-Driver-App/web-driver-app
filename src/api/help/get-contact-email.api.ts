import axios from "api/axios"
import errorApi from "api/error.api"

const GET_SUPPORT_CONTACT_EMAIL_URL = '/user/help/support-email'

export interface IGetSupportContactEmailResponse {
    message: string,
    data: string
}

export async function getSupportContactEmailApi(): Promise<{ success: boolean, message: string, data: string | null }> {
    try {
        const axiosResult = await axios.get(GET_SUPPORT_CONTACT_EMAIL_URL, { headers: {
            'Content-Type': 'application/json'
        } })

        const response: IGetSupportContactEmailResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data }
    } catch (error: any) {
        return await errorApi<string>(error, getSupportContactEmailApi, null, null)
    }
}