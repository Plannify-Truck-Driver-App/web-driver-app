import { AxiosError } from "axios"
import { Suspension } from "models/suspension.model"
import { NavigateFunction } from "react-router-dom"
import { toast } from "sonner"
import { refreshTokenApi } from "./user/refresh-token.api"
import { TokenPayload } from "models/payload-token.model"
import { LightUser } from "models"

export interface IContexteApi {
    navigation: NavigateFunction,
    authentification: { accessToken: string, refreshToken: string, payload: TokenPayload } | null,
    setAuthentification: Function | null
}

export interface IErrorApi {
    status?: number,
    message?: string
}

export const errorApi = async <T>(error: any, fonction: (request: any, context: IContexteApi | null) => Promise<{ success: boolean, message: string, data: T | null}>, request: any, context: IContexteApi | null): Promise<{ success: boolean, message: string, data: T | null}> => {
    if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") {
            toast.error("Impossible de se connecter au serveur.")

            if (context) {
                context.setAuthentification ? context.setAuthentification(null) : void
                context.navigation('/connexion')
            }
        } else if (error.response && error.response.data) {
            if ('status' in error.response) {
                // erreur interne du serveur
                if (error.response.status === 500) {
                    if ('message' in error.response.data) {
                        toast.error(error.response.data.message)
                    } else {
                        toast.error("Une erreur serveur est survenue.")
                    }
                    
                // compte suspendu
                } else if (error.response.data.error === "SUSPENSION") {
                    if (context) {
                        if (context.setAuthentification) context.setAuthentification(null)
                        context.navigation('/suspension', { state: { suspension: Suspension.fromJSON(error.response.data.data) } })
                    }    
                // utilisateur non vérifié
                } else if (error.response.data.error === "VERIFICATION") {
                    if (context) {
                        if (context.setAuthentification) context.setAuthentification(null)
                        context.navigation('/verification', { state: { user: LightUser.fromJSON(error.response.data.data) } })
                    }
                // token erroné
                } else if (error.response.status === 401) {
                    if (context) {
                        const token = await refreshTokenApi(context)

                        if (token && context.authentification && token.data) {
                            return fonction(request, { ...context, authentification: { ...context.authentification, accessToken: token.data?.accessToken }})
                        } else {
                            if (context.setAuthentification) context.setAuthentification(null)
                            context.navigation('/connexion')
                        }
                    }
                // mise-à-jour de l'application
                } else if (error.response.data.error === "UPDATE") {
                    if (context)
                        context.navigation('/mise-a-jour')
                } else if (error.response.status === 404 && error.response.data.message.split(' ')[0] === "Cannot") {
                    if (context)
                        context.navigation('/mise-a-jour')
                } else {
                    if ('message' in error.response.data) {
                        toast.warning(error.response.data.message);
                        return { success: false, message: error.response.data.message, data: null }
                    } else {
                        toast.warning("Une erreur est survenue.");
                    }
                }
            } else {
                toast.error("Le serveur n'a retourné aucun statut.");
            }
        } else {
            toast.error("Le serveur n'a retourné aucune donnée.");
        }
    } else {
        toast.error("Une erreur critique indéfinie est survenue.");
    }

    return { success: false, message: "Une erreur est survenue.", data: null }
}

export default errorApi