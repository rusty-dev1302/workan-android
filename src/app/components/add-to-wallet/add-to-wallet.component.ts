import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-to-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-to-wallet.component.html',
  styleUrls: ['./add-to-wallet.component.css']
})
export class AddToWalletComponent {
  @Input()
  accountBalance:number = 0;

  @Output()
  addAmountEmmiter = new EventEmitter<number>();
  
  addAmount: number = 0;
  spinner: boolean = false;

  addMoney() {
    this.spinner = true;
    this.addAmountEmmiter.emit(this.addAmount);
  }

  resetDialog() {
    this.spinner = false;
    this.addAmount = 0;
  }
}
