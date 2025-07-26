export class MailAttachment {
    attachmentId: string;
    fileName: string;
    fileType: string;

    public constructor (attachmentId: string, fileName: string, fileType: string) {
        this.attachmentId = attachmentId;
        this.fileName = fileName;
        this.fileType = fileType;
    }

    public static fromJSON (json: any): MailAttachment {
        return new MailAttachment(
            json['pk_attachment_id'],
            json['file_name'],
            json['file_type']
        );
    }
}