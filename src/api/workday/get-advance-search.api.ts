import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"
import { Workday, PdfWorkdayMonthly } from "models"
import moment from "moment"

const GET_ADVANCE_SEARCH_WORKDAY_URL: string = '/user/workdays/advanced-search'

export interface IGetAdvanceSearchWorkdayRequest {
    startDate: Date,
    endDate: Date,
    page: number
}

export interface IGetAdvanceSearchWorkdayResponse {
    message: string,
    data: {
        pagination: {
            page: number,
            limit: number,
            count: number
        },
        research: {
            workdays: Workday[],
            file: PdfWorkdayMonthly | null
        }[]
    }
}

export async function getAdvanceSearchWorkdayApi(request: IGetAdvanceSearchWorkdayRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { pagination: { page: number, limit: number, total: number }, research: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null }[] } | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult: AxiosResponse = await axios.get(GET_ADVANCE_SEARCH_WORKDAY_URL, {
            params: {
                page: request.page,
                from: moment(request.startDate).format('YYYY-MM-DD'),
                to: moment(request.endDate).format('YYYY-MM-DD')
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IGetAdvanceSearchWorkdayResponse = axiosResult.data

        return {
            success: true,
            message: response.message,
            data: {
                pagination: {
                    page: response.data.pagination.page,
                    limit: response.data.pagination.limit,
                    total: response.data.pagination.count
                },
                research: response.data.research.map(r => ({
                    workdays: r.workdays.map(j => Workday.fromJSON(j)),
                    pdfFile: r.file ? PdfWorkdayMonthly.fromJSON(r.file) : null
                }))
            }
        }
    } catch (error: any) {
        return await errorApi<{ pagination: { page: number, limit: number, total: number }, research: { workdays: Workday[], pdfFile: PdfWorkdayMonthly | null }[] }>(error, getAdvanceSearchWorkdayApi, request, context)
    }
}