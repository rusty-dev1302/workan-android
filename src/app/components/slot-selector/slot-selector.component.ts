import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent implements OnInit{
  currentDate!: string;

  constructor(
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
  }

  slotDate(index: number): Date {
    let date: Date = new Date();
    date.setDate(date.getDate()+index);

    return date;
  }

  getSlotsForDay(date: Date) {
    if(date){
      this.currentDate = this.datePipe.transform(date, 'EEEE')!;
      console.log(this.currentDate)
    }
  }

}
