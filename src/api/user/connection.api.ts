import axios from "api/axios";
import errorApi, { IContexteApi } from "api/error.api";
import { AxiosResponse } from "axios";

const CONNECTION_URL: string = '/user/login'

export interface IConnectionRequest {
    email: string,
    password: string
}

export interface IConnectionResponse {
    message: string,
    data: {
        access_token: string,
        refresh_token: string
    }
}

export async function connectionApi(request: IConnectionRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { accessToken: string, refreshToken: string } | null }> {
    try {
        const axiosResult: AxiosResponse = await axios.post(CONNECTION_URL, {
            email: request.email,
            password: request.password,
            app_version: process.env.REACT_APP_VERSION
        }, { headers: { 'Content-Type': 'application/json' } })

        const response: IConnectionResponse = axiosResult.data

        return { success: true, message: response.message, data: { accessToken: response.data.access_token, refreshToken: response.data.refresh_token }}
    } catch (error: any) {
        return await errorApi<{ accessToken: string, refreshToken: string }>(error, connectionApi, request, context)
    }
}