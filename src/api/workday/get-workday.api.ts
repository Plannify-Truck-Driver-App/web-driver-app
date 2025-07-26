import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { Workday } from "models"

const GET_WORKDAY_URL = '/user/workdays/'

export interface IGetWorkdayRequest {
    workdayDate: string
}

export interface IGetWorkdayResponse {
    message: string,
    data: Workday
}

export async function getWorkdayApi(request: IGetWorkdayRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: Workday | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.get(GET_WORKDAY_URL + request.workdayDate, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IGetWorkdayResponse = axiosResult.data

        return { success: true, message: response.message, data: Workday.fromJSON(response.data) }
    } catch (error: any) {
        return await errorApi<Workday>(error, getWorkdayApi, request, context)
    }
}