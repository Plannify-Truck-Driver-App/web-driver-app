import axios from "api/axios"
import errorApi from "api/error.api"
import { Update } from "models/update.model"

const GET_APP_UPDATES_URL = '/user/help/app-updates'

export interface IGetAppUpdatesResponse {
    message: string,
    data: Update[]
}

export async function getAppUpdatesApi(): Promise<{ success: boolean, message: string, data: Update[] | null }> {
    try {
        const axiosResult = await axios.get(GET_APP_UPDATES_URL, {
            params: {
                entity: "USER"
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const response: IGetAppUpdatesResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map((update: Update) => Update.fromJSON(update)) }
    } catch (error: any) {
        return await errorApi<Update[]>(error, getAppUpdatesApi, null, null)
    }
}