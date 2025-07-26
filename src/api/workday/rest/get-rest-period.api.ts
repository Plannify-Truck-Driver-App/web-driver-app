import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { RestPeriod } from "models/rest-period.model"

const GET_REST_PERIODS_API = '/user/rest-periods'

export interface IGetRestPeriodsResponse {
    message: string,
    data: RestPeriod[] | null
}

export async function getRestPeriodsApi(request: null, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: RestPeriod[] | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.get(GET_REST_PERIODS_API, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context.authentification.accessToken}`
                }
            })

        const response: IGetRestPeriodsResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data ? response.data.map(restPeriodJson => RestPeriod.fromJSON(restPeriodJson)) : null }
    } catch (error: any) {
        return await errorApi<RestPeriod[]>(error, getRestPeriodsApi, request, context)
    }
}