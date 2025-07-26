export class PdfWorkdayMonthly {
    fileName: string;
    creationDate: Date;
    month: number;
    year: number;

    public constructor(fileName: string, creationDate: Date, month: number, year: number) {
        this.fileName = fileName;
        this.creationDate = creationDate;
        this.month = month;
        this.year = year;
    }

    public static fromJSON(json: any): PdfWorkdayMonthly {
        return new PdfWorkdayMonthly(
            json['file_name'],
            new Date(json['created_at']),
            json['month'],
            json['year']
        );
    }
}