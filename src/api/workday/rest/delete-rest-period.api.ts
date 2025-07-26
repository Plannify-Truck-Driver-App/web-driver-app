import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"

const DELETE_REST_PERIODS_API = '/user/rest-periods'

export interface IDeleteRestPeriodsResponse {
    message: string,
    data: null
}

export async function deleteRestPeriodsApi(request: null, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.delete(DELETE_REST_PERIODS_API, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context.authentification.accessToken}`
                }
            })

        const response: IDeleteRestPeriodsResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, deleteRestPeriodsApi, request, context)
    }
}