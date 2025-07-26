import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { Workday } from "models"
import moment from "moment"

const ADD_WORKDAY_REPLACE_URL: string = '/user/workdays/duplicate'

export interface IAddWorkdayReplaceRequest {
    workdayDate: Date,
    startHour: Date,
    endHour: Date | null,
    restPeriod: Date,
    overnightRest: boolean
}

export interface IAddWorkdayReplaceResponse {
    message: string,
    data: Workday
}

export async function addWorkdayReplaceApi(request: IAddWorkdayReplaceRequest, context: IContexteApi | null): Promise<{ success: boolean,  message: string, data: Workday | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.post(ADD_WORKDAY_REPLACE_URL, {
            date: moment(request.workdayDate).format("YYYY-MM-DD"),
            start_hour: moment(request.startHour).format("HH:mm:ss"),
            end_hour: request.endHour ? moment(request.endHour).format("HH:mm:ss") : null,
            rest: moment(request.restPeriod).format("HH:mm:ss"),
            overnight_rest: request.overnightRest
        }, { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.authentification.accessToken}`
        } })

        const response: IAddWorkdayReplaceResponse = axiosResult.data

        return { success: true, message: response.message, data: Workday.fromJSON(response.data)}
    } catch (error: any) {
        return await errorApi<Workday>(error, addWorkdayReplaceApi, request, context)
    }
}