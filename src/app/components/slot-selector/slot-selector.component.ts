import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ListingService } from 'src/app/services/listing.service';
import { SlotTemplateItem } from 'src/app/common/slot-template-item';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent implements OnInit{
  currentDate!: string;
  currentSlots!: SlotTemplateItem[];
  selectedSlot!: SlotTemplateItem;
  currentStep: number = 0;

  @Input() listingId:number=0;

  constructor(
    private datePipe: DatePipe,
    private listingService: ListingService
  ) {
  }

  ngOnInit(): void {
    this.getSlotsForDay(new Date());
  }

  slotDate(index: number): Date {
    let date: Date = new Date();
    date.setDate(date.getDate()+index);

    return date;
  }

  getSlotsForDay(date: Date) {
    if(date){
      this.currentDate = this.datePipe.transform(date, 'EEEE')!;
      this.listingService.getAvailableSlotsItems(this.listingId, this.datePipe.transform(date, 'EEEE')!).subscribe(
        (data) => {
          if(data) {
            this.currentSlots = data;
            this.currentSlots.sort(
              (a,b) => {
                return a.startTimeHhmm - b.startTimeHhmm;
              }
              );
              
          }
        }
      );
    }
  }

  convertTimeToString(time: number): string{
    let hour = Math.floor(time/100)<=12?Math.floor(time/100):Math.floor(time/100)%12;
    let min = (time%100==0?"00":time%100);
    let merd = (Math.floor(time/100)<12?"AM":"PM");

    return (hour==0?"00":hour)+":"+min+merd;
  }

  selectSlot(slot: SlotTemplateItem) {
    this.selectedSlot = slot;
  }

  closeDialog() {
    this.selectedSlot = null!;
    this.currentStep = 0;
  }

  nextStep() {
    this.currentStep++;
  }

}
