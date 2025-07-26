import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { TrashWorkday } from "models"

const DELETE_WORKDAY_URL: string = '/user/workdays'

export interface IDeleteWorkdayRequest {
    workdayDate: string
}

export interface IDeleteWorkdayResponse {
    message: string,
    data: TrashWorkday
}

export async function deleteWorkdayApi(request: IDeleteWorkdayRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: TrashWorkday | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.delete(DELETE_WORKDAY_URL + '/' + request.workdayDate, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IDeleteWorkdayResponse = axiosResult.data

        return { success: true, message: response.message, data: TrashWorkday.fromJSON(response.data) }
    } catch (error: any) {
        return await errorApi<TrashWorkday>(error, deleteWorkdayApi, request, context)
    }
}