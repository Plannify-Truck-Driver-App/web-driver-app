export class Suspension {
    startAt: Date;
    endAt: Date | null;
    canAccessRestrictedArea: boolean;
    message: string;

    public constructor(startAt: Date, endAt: Date | null, canAccessRestrictedArea: boolean, message: string) {
        this.startAt = startAt;
        this.endAt = endAt;
        this.canAccessRestrictedArea = canAccessRestrictedArea;
        this.message = message;
    }

    public static fromJSON(json: any): Suspension {
        return new Suspension(
            new Date(json['start_at']),
            json['end_at'] ? new Date(json['end_at']) : null,
            json['can_access_restricted_space'],
            json['message']
        );
    }
}