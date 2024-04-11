import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from 'src/app/common/services/date-time.service';

@Component({
  selector: 'app-unavailability-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unavailability-calendar.component.html',
  styleUrls: ['./unavailability-calendar.component.css']
})
export class UnavailabilityCalendarComponent implements OnInit{

  @Output() markUnavailableEvent = new EventEmitter<Date>();

  value!: string;
  minValue!:string;

  ngOnInit(): void {
    this.value = this.datePipe.transform(new Date(), "yyyy-MM-dd")!;
    this.minValue = this.datePipe.transform(new Date(), "yyyy-MM-dd")!;
  }

  constructor(
    private datePipe: DatePipe,
    private dateTimeService: DateTimeService
  ) {}

  markUnavailable() {
    console.log("Sending date");
    this.markUnavailableEvent.emit(this.dateTimeService.truncateTimezone(new Date(this.value)));
  }
}
