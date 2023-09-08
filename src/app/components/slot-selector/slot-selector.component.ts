import { Component, OnInit } from '@angular/core';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent implements OnInit{

  constructor() {
  }

  ngOnInit(): void {
  }

  slotDate(index: number): Date {
    let date: Date = new Date();
    date.setDate(date.getDate()+index);

    return date;
  }

}
