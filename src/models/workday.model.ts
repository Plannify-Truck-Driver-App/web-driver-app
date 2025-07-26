import moment from "moment";
import { RestPeriod } from "./rest-period.model";

export class Workday {
    workdayDate: Date;
    startHour: Date;
    endHour: Date | null;
    restPeriod: Date;
    overnightRest: boolean;

    public constructor(workdayDate: Date, startHour: Date, endHour: Date | null, restPeriod: Date, overnightRest: boolean) {
        this.workdayDate = workdayDate;
        this.startHour = startHour;
        this.endHour = endHour;
        this.restPeriod = restPeriod;
        this.overnightRest = overnightRest;
    }

    public static fromJSON(json: any): Workday {
        return new Workday(
            new Date(json['date']),
            new Date(json['date'] + " " + json['start']),
            json['end'] ? new Date(json['date'] + " " + json['end']) : null,
            new Date(json['date'] + " " + json['rest']),
            json['overnight_rest']
        );
    }

    public static generateHoursFromSeconds(seconds: number): { hours: string, minutes: string, seconds: string } {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const second = seconds % 60;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = second.toString().padStart(2, '0');

        return { hours: formattedHours, minutes: formattedMinutes, seconds: formattedSeconds };
    }

    public static formatWorkTimeToString(seconds: number, withDots: boolean, p: { showHour: boolean, showMinute: boolean, showSecond: boolean }): string {
        const time: { hours: string, minutes: string, seconds: string } = Workday.generateHoursFromSeconds(seconds);

        if (withDots) {
            return `${p.showHour ? time.hours + ':' : ''}${p.showMinute ? time.minutes + ':' : ''}${p.showSecond ? time.seconds : ''}`;
        } else {
            return `${p.showHour ? time.hours + 'h' : ''}${p.showMinute ? time.minutes + 'm' : ''}${p.showSecond ? time.seconds + 's' : ''}`;
        }
    }

    private static calculSeconds(date: Date): number {
        return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    }

    public calculWorkTimeInSeconds(): number {
        if (!this.endHour) return 0;

        if (this.startHour < this.endHour) {
            // début 05h00 - fin 18h00
            return (Workday.calculSeconds(this.endHour) - Workday.calculSeconds(this.startHour)) - Workday.calculSeconds(this.restPeriod);
        } else {
            // début 18h00 - fin 05h00
            return (24 * 3600 - ((Workday.calculSeconds(this.startHour) - Workday.calculSeconds(this.endHour)))  - Workday.calculSeconds(this.restPeriod))
        }
    }

    public static getRestPeriod(startHour: Date, endHour: Date, restPeriods: RestPeriod[]): RestPeriod | undefined {
        let workTimeSeconds: number = 0;
        if (startHour < endHour) {
            // début 05h00 - fin 18h00
            workTimeSeconds = Workday.calculSeconds(endHour) - Workday.calculSeconds(startHour);
        } else {
            // début 18h00 - fin 05h00
            workTimeSeconds = 24 * 3600 - ((Workday.calculSeconds(startHour) - Workday.calculSeconds(endHour)))
        } 

        // const workTimeMiliseconds: number = endHour.getTime() - startHour.getTime();
        const workTimeString: string = this.formatWorkTimeToString(workTimeSeconds, true, { showHour: true, showMinute: true, showSecond: true });
        const rest: RestPeriod | undefined = restPeriods.find(
            (restPeriod: RestPeriod) => restPeriod.startInterval.getTime() <= new Date(moment(restPeriod.startInterval).format('YYYY-MM-DD') + ' ' + workTimeString).getTime()
            && restPeriod.endInterval.getTime() >= new Date(moment(restPeriod.startInterval).format('YYYY-MM-DD') + ' ' + workTimeString).getTime());

        return rest;
    }
}