import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-redeem-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redeem-wallet.component.html',
  styleUrls: ['./redeem-wallet.component.css']
})
export class RedeemWalletComponent {
  @Input()
  accountBalance:number = 0;

  @Output()
  addAmountEmmiter = new EventEmitter<number>();
  
  addAmount: number = 0;
  spinner: boolean = false;
  invalidInput: boolean = false;

  addMoney() {
    this.spinner = true;
    this.addAmountEmmiter.emit(this.addAmount);
  }

  resetDialog() {
    this.spinner = false;
    this.addAmount = 0;
  }

  roundUp(input: number) {
    if (!Number.isInteger(input)) {
      this.invalidInput = true;
    } else {
      this.invalidInput = false
    }
  }
}
