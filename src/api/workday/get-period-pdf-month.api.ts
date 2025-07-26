import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { PdfPeriod } from "models"

const GET_PERIOD_PDF_MONTH_URL: string = '/user/workdays/pdf'

export interface IGetPeriodPdfMonthResponse {
    message: string,
    data: PdfPeriod[]
}

export async function getPeriodPdfMonthApi(context: IContexteApi | null): Promise<{ success: boolean, message: string, data: PdfPeriod[] | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.get(GET_PERIOD_PDF_MONTH_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.authentification.accessToken}`
            }
        })

        const response: IGetPeriodPdfMonthResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map(j => PdfPeriod.fromJSON(j))}
    } catch (error: any) {
        return await errorApi<PdfPeriod[]>(error, getPeriodPdfMonthApi, null, context)
    }
}