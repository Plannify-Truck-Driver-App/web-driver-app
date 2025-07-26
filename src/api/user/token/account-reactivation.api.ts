import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"

const ACCOUNT_REACTIVATION_URL: string = '/user/token/{token}/account-reactivation'

export interface IAccountReactivationRequest {
    token: string;
}

export async function accountReactivationApi(request: IAccountReactivationRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: boolean | null }> {
    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = ACCOUNT_REACTIVATION_URL.replace("{token}", request.token);

        const axiosResult: AxiosResponse = await axios.patch(urlWithToken, null)

        return { success: true, message: axiosResult.data.message, data: axiosResult.data.data === null }
    } catch (error: any) {
        return await errorApi<boolean>(error, accountReactivationApi, request, context)
    }
}