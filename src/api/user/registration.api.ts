import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";
import { LightUser } from "models";

const INSCRIPTION_URL: string = '/user/registration'

export interface IRegistrationRequest {
    firstname: string,
    lastname: string,
    gender: string | null,
    email: string,
    password: string
}

export interface IRegistrationResponse {
    message: string,
    data: {
        user_id: string,
        firstname: string,
        lastname: string,
        gender: string | null,
        email: string
    }
}

export async function registrationApi(request: IRegistrationRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: LightUser | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.post(INSCRIPTION_URL, {
            firstname: request.firstname,
            lastname: request.lastname,
            gender: request.gender?.length === 0 ? null : request.gender,
            email: request.email,
            password: request.password,
            language: 'fr-fr'
        }, { headers: { 'Content-Type': 'application/json' } })

        const response: IRegistrationResponse = axiosResult.data

        if (response.data) {
            return { success: true, message: response.message, data: LightUser.fromJSON(response.data) }
        } else {
            return { success: false, message: response.message, data: null }
        }
    } catch (error: any) {
        return await errorApi<LightUser>(error, registrationApi, request, context)
    }
}