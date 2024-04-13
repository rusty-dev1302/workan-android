import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-workan-calendar',
  standalone: true,
  imports: [CommonModule, NgxDaterangepickerMd],
  templateUrl: './workan-calendar.component.html',
  styleUrls: ['./workan-calendar.component.css']
})
export class WorkanCalendarComponent implements AfterViewInit, OnInit {

  viewCalendar: boolean = false;
  singleDate: boolean = true;

  selectedStartDate:string = "";
  selectedEndDate:string = "";

  @Output()
  datesSelected = new EventEmitter<string[]>();

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit(): void {
  }

  onchange(event: any) {
    this.selectedStartDate = this.datePipe.transform(event.startDate.toDate(),'dd MMM (EEE)','+0000')!;
    this.selectedEndDate = this.datePipe.transform(event.endDate.toDate(),'dd MMM (EEE)','+0000')!;

    const datesSeleted:string[] = [];
    datesSeleted.push(this.datePipe.transform(event.startDate.toDate(),'yyyy-MM-dd','+0000')!);

    if(this.selectedStartDate==this.selectedEndDate) {
      this.singleDate = true;
    } else {
      this.singleDate = false;
      datesSeleted.push(this.datePipe.transform(event.endDate.toDate(),'yyyy-MM-dd','+0000')!);
    }
    
    this.datesSelected.emit(datesSeleted);

    this.closeCalendar();
  }

  closeCalendar() {
    this.viewCalendar = false;
  }

  ngAfterViewInit() {
    const rightCalendar = document.getElementsByClassName('calendar right');
    if (rightCalendar.item(0)) {
      rightCalendar.item(0)!.remove();
    }
  }

  toggleCalendar() {
    this.viewCalendar = !this.viewCalendar;
  }

}
