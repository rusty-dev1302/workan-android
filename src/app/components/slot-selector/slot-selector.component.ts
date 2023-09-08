import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent implements OnInit{
  currentDate!: string;

  @Input() listingId:number=0;

  constructor(
    private datePipe: DatePipe,
    private listingService: ListingService
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
      this.currentDate = this.datePipe.transform(date, 'EE')!;
      this.listingService.getAvailableSlotsItems(this.listingId, this.datePipe.transform(date, this.currentDate)!).subscribe(
        (data) => {
          console.log("slots"+data)
        }
      );
    }
  }

}
