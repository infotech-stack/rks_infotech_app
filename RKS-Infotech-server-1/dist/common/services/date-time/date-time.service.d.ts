export declare class DateTimeService {
    getDateTime(timeZoneIanaString: string): any;
    getDate(timeZoneIanaString: string): any;
    getTime(timeZoneIanaString: string): any;
    setDateTime(dateTime: Date): any;
    cuttentTimestamp(): Promise<any>;
}
