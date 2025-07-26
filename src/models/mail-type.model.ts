export class MailType {
    mailTypeId: number;
    label: string;
    description: string;
    isEditable: boolean = false;

    public constructor (mailTypeId: number, label: string, description: string, isEditable: boolean) {
        this.mailTypeId = mailTypeId;
        this.label = label;
        this.description = description;
        this.isEditable = isEditable;
    }

    public static fromJSON (json: any): MailType {
        return new MailType(
            json['pk_mail_type_id'],
            json['label'],
            json['description'],
            json['is_editable']
        );
    }
}