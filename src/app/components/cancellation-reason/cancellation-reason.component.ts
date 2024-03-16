import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-cancellation-reason',
    templateUrl: './cancellation-reason.component.html',
    styleUrls: ['./cancellation-reason.component.css'],
    standalone: true,
    imports: [NgFor]
})
export class CancellationReasonComponent {

  @Input()
  cancellationReason: any[]=[];

  @Output()
  cancellationReasonEvent = new EventEmitter<any>();

  currentCancellationReason: any;

  setCancellationReason(currentCancellationReason:any) {
    this.currentCancellationReason = currentCancellationReason;
  }

  cancel() {
    this.cancellationReasonEvent.emit(this.currentCancellationReason);
  }

}
