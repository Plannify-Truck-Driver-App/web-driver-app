import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const SUBSCRIBRE_NOTIFICATION_LIST_URL: string = '/user/registration/subscribe'

export interface ISubscribeNotificationListRequest {
    email: string
}

export async function subscribeNotificationListApi(request: ISubscribeNotificationListRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.post(SUBSCRIBRE_NOTIFICATION_LIST_URL, {
            email: request.email
        }, { headers: { 'Content-Type': 'application/json' } })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, subscribeNotificationListApi, null, context)
    }   
}