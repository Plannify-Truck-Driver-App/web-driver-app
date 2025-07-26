import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { TrashWorkday } from "models"

const GET_TRASH_WORKDAY_URL: string = '/user/workdays/trash'

export interface IGetWorkdayMonthResponse {
    message: string,
    data: TrashWorkday[]
}

export async function getTrashWorkdayApi(request: null, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: TrashWorkday[] | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult = await axios.get(GET_TRASH_WORKDAY_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IGetWorkdayMonthResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map(j => TrashWorkday.fromJSON(j))}
    } catch (error: any) {
        return await errorApi<TrashWorkday[]>(error, getTrashWorkdayApi, null, context)
    }
}