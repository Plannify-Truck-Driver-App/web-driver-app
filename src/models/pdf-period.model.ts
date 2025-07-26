export class PdfPeriod {
    month: number;
    year: number;

    public constructor(month: number, year: number) {
        this.month = month;
        this.year = year;
    }

    public static fromJSON(json: any): PdfPeriod {
        return new PdfPeriod(
            json['month'],
            json['year']
        );
    }
}