import { LightUser } from "./light-user.model";
import { RestPeriod } from "./rest-period.model";

export class FullUser extends LightUser {
    phoneNumber: string | null;
    isSearchable: boolean;
    allowProfessionnalRequestAgreement: boolean;
    language: string;
    restPeriods: RestPeriod[] | null;
    creationDate: Date;
    verificationDate: Date | null;
    desactivationDate: Date | null;

    public constructor(userId: string, firstname: string, lastname: string, gender: string | null, email: string, phoneNumber: string | null, isSearchable: boolean, allowProfessionnalRequestAgreement: boolean, language: string, restPeriods: RestPeriod[] | null, creationDate: Date, verificationDate: Date | null, desactivationDate: Date | null) {
        super(userId, firstname, lastname, gender, email);
        this.phoneNumber = phoneNumber;
        this.isSearchable = isSearchable;
        this.allowProfessionnalRequestAgreement = allowProfessionnalRequestAgreement;
        this.language = language;
        this.restPeriods = restPeriods;
        this.creationDate = creationDate;
        this.verificationDate = verificationDate;
        this.desactivationDate = desactivationDate;
    }

    public static fromJSON(json: any): FullUser {
        return new FullUser(
            json['user_id'],
            json['firstname'],
            json['lastname'],
            json['gender'],
            json['email'],
            json['phone_number'],
            json['is_searchable'],
            json['allow_request_professional_agreement'],
            json['language'],
            json['rest'] ? JSON.parse(json['rest']).map((restPeriodJson: any) => RestPeriod.fromJSON(restPeriodJson)) : null,
            new Date(json['created_at']),
            json['verified_at'] ? new Date(json['verified_at']) : null,
            json['deactivated_at'] ? new Date(json['deactivated_at']) : null
        );
    }
}