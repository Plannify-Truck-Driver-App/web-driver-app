import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const STATUS_DEACTIVATE_MAIL_PREFERENCE: string = '/user/token/{token}/mail-preference-status/{typeMailId}'

export interface IStatusDeactivateMailPreferenceRequest {
    token: string;
    typeMailId: number;
}

export interface IStatusDeactivateMailPreferenceResponse {
    message: string,
    data: {
        is_active: boolean,
        is_editable: boolean
    } | null
}

export async function statusDeactivateMailPreferenceApi(request: IStatusDeactivateMailPreferenceRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { isActive: boolean, isEditable: boolean } | null }> {
    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = STATUS_DEACTIVATE_MAIL_PREFERENCE.replace("{token}", request.token).replace("{typeMailId}", request.typeMailId.toString());

        const axiosResult: AxiosResponse = await axios.get(urlWithToken, { headers: { 'Content-Type': 'application/json' } });

        const response: IStatusDeactivateMailPreferenceResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data ? { isActive: response.data.is_active, isEditable: response.data.is_editable } : null };
    } catch (error: any) {
        return await errorApi<{ isActive: boolean, isEditable: boolean }>(error, statusDeactivateMailPreferenceApi, request, context)
    }
}