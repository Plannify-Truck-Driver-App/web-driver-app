import { getSupportContactEmailApi } from "api/help/get-contact-email.api"
import { jwtDecode } from "jwt-decode"
import { LightUser } from "models"
import { TokenPayload } from "models/payload-token.model"
import { Suspension } from "models/suspension.model"

export const tokenToPayload = async (token: string): Promise<TokenPayload> => {
    const payload = jwtDecode<TokenPayload>(token)

    const response = await getSupportContactEmailApi()
    
    return {
        sub: payload.sub,
        exp: payload.exp,
        user: LightUser.fromJSON(payload.user),
        suspension: payload.suspension ? {
            data: Suspension.fromJSON(payload.suspension),
            contactEmail: response.success ? response.data : null
        } : null,
        deactivation: payload.deactivation
    }
}