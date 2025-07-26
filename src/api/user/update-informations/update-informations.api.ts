import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const UPDATE_INFORMATIONS_URL: string = '/user/informations'

export interface IUpdateInformationsRequest {
    firstname: string,
    lastname: string,
    gender: string | null,
    phoneNumber: string | null
}

export interface IUpdateInformationsResponse {
    message: string,
    data: null
}

export async function updateInformationsApi(request: IUpdateInformationsRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.patch(UPDATE_INFORMATIONS_URL, {
            firstname: request.firstname,
            lastname: request.lastname,
            gender: request.gender,
            phone_number: request.phoneNumber,
            is_searchable: true,
            allow_request_professional_agreement: true,
            language: "fr-fr"
        }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.authentification.accessToken}` } })

        const response: IUpdateInformationsResponse = axiosResult.data

        return { success: true, message: response.message, data: null }
    } catch (error: any) {
        return await errorApi<null>(error, updateInformationsApi, request, context)
    }
}