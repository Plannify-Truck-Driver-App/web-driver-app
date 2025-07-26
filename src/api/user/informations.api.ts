import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const USER_INFORMATIONS_URL: string = '/user/informations'

export interface IUserInformationsResponse {
    message: string,
    data: {
        user_id: string,
        firstname: string,
        lastname: string,
        gender: string | null,
        email: string,
        phone_number: string | null,
        is_searchable: boolean,
        allow_request_professional_agreement: boolean,
        language: string,
        created_at: string,
        verified_at: string | null,
        deactivated_at: string | null
    }
}

export async function getUserInformationsApi(request: null, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { userId: string, firstname: string, lastname: string, gender: string | null, email: string, phoneNumber: string | null, isSearchable: boolean, allowProfessionalRequest: boolean, language: string, createdAt: Date, verifiedAt: Date | null, deactivateAt: Date | null } | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.get(USER_INFORMATIONS_URL, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.authentification.accessToken}` }
        })

        const response: IUserInformationsResponse = axiosResult.data

        return {
            success: true,
            message: response.message,
            data: {
                userId: response.data.user_id,
                firstname: response.data.firstname,
                lastname: response.data.lastname,
                gender: response.data.gender,
                email: response.data.email,
                phoneNumber: response.data.phone_number,
                isSearchable: response.data.is_searchable,
                allowProfessionalRequest: response.data.allow_request_professional_agreement,
                language: response.data.language,
                createdAt: new Date(response.data.created_at),
                verifiedAt: response.data.verified_at ? new Date(response.data.verified_at) : null,
                deactivateAt: response.data.deactivated_at ? new Date(response.data.deactivated_at) : null
            }
        }
    } catch (error: any) {
        return await errorApi<{ userId: string, firstname: string, lastname: string, gender: string | null, email: string, phoneNumber: string | null, isSearchable: boolean, allowProfessionalRequest: boolean, language: string, createdAt: Date, verifiedAt: Date | null, deactivateAt: Date | null }>(error, getUserInformationsApi, request, context)
    }
}