export class Maintenance {
    message: string;
    startAt: Date;
    endAt: Date;

    public constructor(message: string, startAt: Date, endAt: Date) {
        this.message = message;
        this.startAt = startAt;
        this.endAt = endAt;
    }

    public static fromJSON(json: any): Maintenance {
        return new Maintenance(
            json['message'],
            new Date(json['start_at']),
            new Date(json['end_at'])
        );
    }
}