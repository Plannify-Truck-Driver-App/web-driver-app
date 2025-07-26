import axios from "api/axios"
import errorApi from "api/error.api"
import { Maintenance } from "models"

const GET_MAINTENANCES_URL = '/user/help/maintenances'

export interface IGetMaintenancesResponse {
    message: string,
    data: Maintenance[]
}

export async function getMaintenancesApi(): Promise<{ success: boolean, message: string, data: Maintenance[] | null }> {
    try {
        const axiosResult = await axios.get(GET_MAINTENANCES_URL, {
            params: {
                entity: "USER"
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const response: IGetMaintenancesResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map((maintenance: Maintenance) => Maintenance.fromJSON(maintenance)) }
    } catch (error: any) {
        return await errorApi<Maintenance[]>(error, getMaintenancesApi, null, null)
    }
}