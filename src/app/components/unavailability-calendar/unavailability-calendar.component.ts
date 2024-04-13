import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { WorkanCalendarComponent } from '../common/workan-calendar/workan-calendar.component';

@Component({
  selector: 'app-unavailability-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkanCalendarComponent],
  templateUrl: './unavailability-calendar.component.html',
  styleUrls: ['./unavailability-calendar.component.css']
})
export class UnavailabilityCalendarComponent implements OnInit{

  @Output() markUnavailableEvent = new EventEmitter<Date[]>();

  values: string[] = [];
  minValue!:string;  

  ngOnInit(): void {
  }

  constructor(
    private dateTimeService: DateTimeService
  ) {}

  handleDates(event:string[]) {
    this.values= event;
  }

  markUnavailable() {
    console.log("Sending date");
    let result:Date[] = [];
    this.values.forEach(
      (date)=>{
        console.log(date);
        result.push(this.dateTimeService.truncateTimezone(new Date(date)));
      }
    );
    this.markUnavailableEvent.emit(result);
  }

  closeDialog() {
    
  }
}
