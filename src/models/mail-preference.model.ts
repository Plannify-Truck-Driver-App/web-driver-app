export class MailPreference {
    mailTypeId: number;
    creationDate: Date;

    public constructor(mailTypeId: number, creationDate: Date) {
        this.mailTypeId = mailTypeId;
        this.creationDate = creationDate;
    }

    public static fromJSON(json: any): MailPreference {
        return new MailPreference(
            json['fk_type_mail_id'],
            new Date(json['date_ajout'])
        );
    }
}