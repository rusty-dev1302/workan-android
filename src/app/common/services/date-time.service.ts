import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor(
    private datePipe: DatePipe
  ) { }

  convertTimeToNumber(time: string): number {
    let hour: number = 0;
    let min: number = 0;
    hour = +time.split(":")[0];

    if (time.includes("AM")) {
      min = +time.split(":")[1].split("AM")[0];
    } else if (time.includes("PM")) {
      min = +time.split(":")[1].split("PM")[0];
      hour = hour == 12 ? 12 : (hour + 12) % 24;
    }

    return hour * 100 + min;
  }

  convertTimeToString(time: number): string {
    if(!time) {
      return "--";
    }
    let hour = Math.floor(time / 100) <= 12 ? Math.floor(time / 100) : Math.floor(time / 100) % 12;
    let min = (time % 100 == 0 ? "00" : time % 100);
    let merd = (Math.floor(time / 100) < 12 ? "AM" : "PM");

    let hourStr = hour == 0 ? "00" : hour;
    hourStr = hour<10?("0"+hourStr):hourStr;

    return hourStr + ":" + min + merd;
  }

  truncateTimezone(date: Date):Date {
    let stringDate: string = this.datePipe.transform(date, 'yyyy-MM-dd', '+0000')+"T00:00:00.000Z";

    return new Date(stringDate);
  }

  truncateTimezoneToString(date: Date):string {
    let stringDate: string = this.datePipe.transform(date, 'yyyy-MM-dd') + "T00:00:00.000000Z";

    return stringDate;
  }

}
