import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const DEACTIVATE_MAIL_PREFERENCE_BY_TOKEN: string = '/user/token/{token}/mail-preference-deactivation'

export interface IDeactivateMailPreferenceByTokenRequest {
    token: string;
    typeMailId: number;
}

export interface IDeactivateMailPreferenceByTokenResponse {
    message: string,
    data: {
        est_actif: boolean,
        est_modifiable: boolean
    } | null
}

export async function deactivateMailPreferenceByTokenApi(request: IDeactivateMailPreferenceByTokenRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = DEACTIVATE_MAIL_PREFERENCE_BY_TOKEN.replace("{token}", request.token);

        const axiosResult: AxiosResponse = await axios.patch(urlWithToken, {
            mail_type_id: request.typeMailId
        }, { headers: { 'Content-Type': 'application/json' } });

        const response: IDeactivateMailPreferenceByTokenResponse = axiosResult.data;

        return { success: true, message: response.message, data: null };
    } catch (error: any) {
        return await errorApi<null>(error, deactivateMailPreferenceByTokenApi, request, context)
    }
}