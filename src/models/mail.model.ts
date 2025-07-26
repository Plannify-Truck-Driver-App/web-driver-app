import { MailAttachment } from "./mail-attachment.model";

export class Mail {
    mailId: string;
    description: string;
    content: string | null;
    mailTypeId: number;
    emailUsed: string;
    state: 'PENDING' | 'SUCCESS' | 'FAIL';
    addDate: Date;
    sendDate: Date | null;
    attachments: MailAttachment[];

    public constructor (mailId: string, description: string, content: string | null, mailTypeId: number, emailUsed: string, state: 'PENDING' | 'SUCCESS' | 'FAIL', addDate: Date, sendDate: Date | null, attachments: MailAttachment[]) {
        this.mailId = mailId;
        this.description = description;
        this.content = content;
        this.mailTypeId = mailTypeId;
        this.emailUsed = emailUsed;
        this.state = state;
        this.addDate = addDate;
        this.sendDate= sendDate;
        this.attachments = attachments;
    }

    public static fromJSON (json: any): Mail {
        return new Mail(
            json['mail_id'],
            json['description'],
            json['content'],
            json['mail_type_id'],
            json['email_used'],
            json['status'] === 'FAILED' ? 'FAIL' : (json['status'] === 'IN_PROGRESS' ? 'PENDING' : 'SUCCESS'),
            new Date(json['created_at']),
            json['sent_at'] ? new Date(json['sent_at']) : null,
            json['attachments'].map((attachment: any) => MailAttachment.fromJSON(attachment))
        );
    }
}