export class TrashWorkday {
    workdayDate: Date;
    creationDate: Date;
    expectedDeletionDate: Date;

    public constructor(workdayDate: Date, creationDate: Date, expectedDeletionDate: Date) {
        this.workdayDate = workdayDate;
        this.creationDate = creationDate;
        this.expectedDeletionDate = expectedDeletionDate;
    }

    public static fromJSON(json: any): TrashWorkday {
        return new TrashWorkday(
            new Date(json['date']),
            new Date(json['created_at']),
            new Date(json['scheduled_deletion_date'])
        );
    }
}