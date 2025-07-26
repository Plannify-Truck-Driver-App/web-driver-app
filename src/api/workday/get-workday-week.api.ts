import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"
import { Workday } from "models"

const GET_WORKDAY_WEEK_URL: string = '/user/workdays/week'

export interface IGetWorkdayWeekResponse {
    message: string,
    data: Workday[]
}

export async function getWorkdayWeekApi(context: IContexteApi | null): Promise<{ success: boolean, message: string, data: Workday[] | null}> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult: AxiosResponse = await axios.get(GET_WORKDAY_WEEK_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IGetWorkdayWeekResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map(j => Workday.fromJSON(j))}
    } catch (error: any) {
        return await errorApi<Workday[]>(error, getWorkdayWeekApi, null, context)
    }
}