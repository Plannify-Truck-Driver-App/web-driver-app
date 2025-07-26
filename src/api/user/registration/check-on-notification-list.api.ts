import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const CHECK_ON_NOTIFICATION_LIST_URL: string = '/user/registration/verify'

export interface ICheckOnNotificationListRequest {
    email: string
}

export async function checkOnNotificationListApi(request: ICheckOnNotificationListRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.get(CHECK_ON_NOTIFICATION_LIST_URL, {
            params: {
                email: request.email
            },
            headers: { 'Content-Type': 'application/json' }
        })

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data }
    } catch (error: any) {
        return await errorApi<boolean>(error, checkOnNotificationListApi, null, context)
    }   
}