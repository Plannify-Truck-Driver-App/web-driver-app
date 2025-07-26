import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"

const RESTORE_WORKDAY_URL: string = '/user/workdays/restore'

export interface IRestoreWorkdayRequest {
    workdayDate: string
}

export interface IRestoreWorkdayResponse {
    message: string,
    data: null
}

export async function restoreWorkdayApi(request: IRestoreWorkdayRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.patch(RESTORE_WORKDAY_URL, {
            date: request.workdayDate
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IRestoreWorkdayResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, restoreWorkdayApi, request, context)
    }
}