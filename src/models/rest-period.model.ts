import moment from "moment";

export class RestPeriod {
    startInterval: Date;
    endInterval: Date;
    restTime: Date;

    public constructor(startInterval: Date, endInterval: Date, restTime: Date) {
        this.startInterval = startInterval;
        this.endInterval = endInterval;
        this.restTime = restTime;
    }

    public static fromJSON(json: any): RestPeriod {
        const workdayString: string = moment(new Date()).format("YYYY-MM-DD");
        
        return new RestPeriod(
            new Date(workdayString + " " + json['start_bound']),
            new Date(workdayString + " " + json['end_bound']),
            new Date(workdayString + " " + json['rest_time'])
        );
    }
}