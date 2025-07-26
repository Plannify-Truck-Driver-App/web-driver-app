import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { Workday } from "models"
import moment from "moment"

const ADD_WORKDAY_URL = '/user/workdays'

export interface IAddWorkdayRequest {
    workdayDate: Date,
    startHour: Date,
    endHour: Date | null,
    restPeriod: Date,
    overnightRest: boolean
}

export interface IAddWorkdayResponse {
    message: string,
    data: Workday
}

export async function addWorkdayApi(request: IAddWorkdayRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: Workday | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.post(ADD_WORKDAY_URL, {
            date: moment(request.workdayDate).format("YYYY-MM-DD"),
            start_hour: moment(request.startHour).format("HH:mm:ss"),
            end_hour: request.endHour ? moment(request.endHour).format("HH:mm:ss") : null,
            rest: moment(request.restPeriod).format("HH:mm:ss"),
            overnight_rest: request.overnightRest
        }, { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.authentification.accessToken}`
        } })

        const response: IAddWorkdayResponse = axiosResult.data

        return { success: true, message: response.message, data: Workday.fromJSON(response.data) }
    } catch (error: any) {
        return await errorApi<Workday>(error, addWorkdayApi, request, context)
    }
}