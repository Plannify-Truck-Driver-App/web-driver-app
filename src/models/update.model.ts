export class Update {
    version: string;
    description: string;
    mandatoryCompletionDate: Date | null;

    public constructor(version: string, description: string, mandatoryCompletionDate: Date | null) {
        this.version = version;
        this.description = description;
        this.mandatoryCompletionDate = mandatoryCompletionDate;
    }

    public static fromJSON(json: any): Update {
        return new Update(
            json['version'],
            json['description'],
            json['mandatory_completion_date'] ? new Date(json['mandatory_completion_date']) : null
        );
    }
}