import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"

const GET_PDF_MONTH_URL: string = '/user/workdays/pdf/generated'

export interface IGetPdfMonthRequest {
    month: number,
    year: number
}

export async function getPdfMonthApi(request: IGetPdfMonthRequest, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: Blob | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        const axiosResult = await axios.get(GET_PDF_MONTH_URL, {
            params: {
                month: request.month,
                year: request.year
            },
            headers: {
                'Authorization': `Bearer ${context.authentification.accessToken}`
            },
            responseType: 'blob', 
        })

        return { success: true, message: "Voici votre fichier.", data: axiosResult.data }
    } catch (error: any) {
        return await errorApi<Blob>(error, getPdfMonthApi, request, context)
    }
}