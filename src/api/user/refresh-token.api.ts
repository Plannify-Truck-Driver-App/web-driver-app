import axios from "api/axios"
import { IContexteApi } from "api/error.api"
import { AxiosResponse } from "axios"
import { TokenPayload } from "models/payload-token.model"
import { toast } from "sonner"
import { tokenToPayload } from "utils/token-to-payload.util"

export interface IRefreshTokenResponse {
    message: string,
    data: {
        access_token: string,
        refresh_token: string
    }
}

const REFRESH_TOKEN_URL: string = '/user/refresh-token/{token}'

export async function refreshTokenApi(context: IContexteApi | null): Promise<{ success: boolean, message: string, data: { accessToken: string, refreshToken: string } | null }> {
    if (!context || !context.authentification) {
        return { success: false, message: "Veuillez être connecté.", data: null }
    }

    try {
        // Replace {token} by the token in the URL
        const urlWithToken: string = REFRESH_TOKEN_URL.replace("{token}", context.authentification.refreshToken);

        const axiosResult: AxiosResponse = await axios.get(urlWithToken, {
            params: {
                version_app: process.env.REACT_APP_VERSION
            },
            headers: { 'Content-Type': 'application/json' }
        })

        const reponse: IRefreshTokenResponse = axiosResult.data

        if (reponse.data !== null) {
            const payload: TokenPayload = await tokenToPayload(reponse.data.access_token)

            if (context.setAuthentification) context.setAuthentification({ accessToken: reponse.data.access_token, refreshToken: reponse.data.refresh_token, payload: payload })

            return { success: true, message: reponse.message, data: { accessToken: reponse.data.access_token, refreshToken: reponse.data.refresh_token } }
        } else {
            return { success: false, message: reponse.message, data: null }
        }
    } catch (erreur: any) {
        if (erreur.code === "ERR_NETWORK") {
            toast.error("Impossible de se connecter au serveur.")
        } else if (erreur.response.data && 'message' in erreur.response.data) {
            toast.error(erreur.response.data.message)
        } else {
            toast.error("Une erreur serveur est survenue.")
        }
        return { success: false, message: erreur.response.data.message, data: null }
    }
}