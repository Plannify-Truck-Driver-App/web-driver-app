import axios from "api/axios"
import errorApi, { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"
import { MailType } from "models/mail-type.model"

const GET_ALL_MAILS_TYPES_URL: string = '/user/mails/types'

export interface IGetAllTypesMailsResponse {
    message: string,
    data: MailType[]
}

export async function getMailsTypesApi(context: IContexteApi | null): Promise<{ success: boolean, message: string, data: MailType[] | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }
    
    try {
        const axiosResult: AxiosResponse = await axios.get(GET_ALL_MAILS_TYPES_URL, { 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.authentification.accessToken}` }
            }
        )

        const response: IGetAllTypesMailsResponse = axiosResult.data

        return { success: true, message: response.message, data: response.data.map(m => MailType.fromJSON(m)) }
    } catch (error: any) {
        return await errorApi<MailType[]>(error, getMailsTypesApi, null, context)
    }
}