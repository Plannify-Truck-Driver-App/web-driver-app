import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"
import { Mail } from "models"

const GET_ALL_MAILS_URL: string = '/user/mails'

export interface IGetAllMailsRequest {
    page: number,
    to: string | undefined,
    from: string | undefined,
    type: number | undefined,
    status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | undefined
}

export interface IGetAllMailsResponse {
    message: string,
    data: Mail[],
    meta: {
        total: number,
        current_page: number,
        limit: number
    }
}

export async function getMailsApi(request: IGetAllMailsRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: Mail[] | null, pagination?: { total: number, currentPage: number, limit: number } }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.get(GET_ALL_MAILS_URL, {
                params: request,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context.authentification.accessToken}`
                }
            }
        )

        const response: IGetAllMailsResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map(m => Mail.fromJSON(m)), pagination: { total: response.meta.total, currentPage: response.meta.current_page, limit: response.meta.limit } }
    } catch (error: any) {
        return await errorApi<Mail[]>(error, getMailsApi, request, context)
    }
}