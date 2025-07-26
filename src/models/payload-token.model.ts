import { LightUser } from "./light-user.model";
import { Suspension } from "./suspension.model";

export interface TokenPayload {
    sub: string,
    user : LightUser,
    suspension: {
        data: Suspension,
        contactEmail: string | null
    } | null,
    deactivation: string | null,
    exp: number
}