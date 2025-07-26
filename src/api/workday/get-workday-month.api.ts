import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"
import { Workday, TrashWorkday, PdfWorkdayMonthly } from "models"

const GET_WORKDAY_MONTH_URL: string = '/user/workdays/month'

export interface IGetWorkdayMonthRequest {
    month: number,
    year: number
}

export interface IGetWorkdayMonthResponse {
    message: string,
    data: {
        workdays: Workday[],
        file: TrashWorkday | null
    }
}

export async function getWorkdayMonthApi(request: IGetWorkdayMonthRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null } | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult: AxiosResponse = await axios.get(GET_WORKDAY_MONTH_URL, {
            params: {
                month: request.month,
                year: request.year
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IGetWorkdayMonthResponse = axiosResult.data

        return { success: true, message: response.message, data: { workdays: response.data.workdays.map(j => Workday.fromJSON(j)), pdfFile: response.data.file ? PdfWorkdayMonthly.fromJSON(response.data.file) : null }}
    } catch (error: any) {
        return await errorApi<{ workdays: Workday[], pdfFile: PdfWorkdayMonthly | null }>(error, getWorkdayMonthApi, request, context)
    }
}