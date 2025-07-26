import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { RestPeriod } from "models/rest-period.model"

const UPDATE_REST_PERIODS_API: string = '/user/rest-periods'

export interface IUpdateRestPeriodsRequest {
    restPeriods: {
        startInterval: string,
        endInterval: string,
        restTime: string
    }[]
}

export interface IUpdateRestPeriodsResponse {
    message: string,
    data: RestPeriod[]
}

export async function updateRestPeriodsApi(request: IUpdateRestPeriodsRequest, context: IContexteApi | null): Promise<{ success: boolean,  message: string, data: RestPeriod[] | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.patch(UPDATE_REST_PERIODS_API, {
            rests: request.restPeriods.map(restPeriod => ({
                start_bound: restPeriod.startInterval,
                end_bound: restPeriod.endInterval,
                rest_time: restPeriod.restTime
            }))
        }, { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.authentification.accessToken}`
        } })

        const response: IUpdateRestPeriodsResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map(restPeriodJson => RestPeriod.fromJSON(restPeriodJson)) }
    } catch (error: any) {
        return await errorApi<RestPeriod[]>(error, updateRestPeriodsApi, request, context)
    }
}