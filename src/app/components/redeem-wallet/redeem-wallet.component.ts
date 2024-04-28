import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnterOtpModalComponent } from '../enter-otp-modal/enter-otp-modal.component';

@Component({
  selector: 'app-redeem-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, EnterOtpModalComponent],
  templateUrl: './redeem-wallet.component.html',
  styleUrls: ['./redeem-wallet.component.css']
})
export class RedeemWalletComponent {
  @Input()
  accountBalance:number = 0;

  @Output()
  redeemAmountEmmiter = new EventEmitter<number>();

  @Output()
  confirmOtpEmmiter = new EventEmitter<string>();
  
  redeemAmount: number = 0;
  spinner: boolean = false;
  invalidInput: boolean = false;
  minBalanceValid: boolean = true;
  enterOtp: boolean = false;

  redeemMoney() {
    this.spinner = true;
    this.enterOtp = true;
    this.redeemAmountEmmiter.emit(this.redeemAmount);
  }

  resetDialog() {
    this.spinner = false;
    this.redeemAmount = 0;
  }

  roundUp(input: number) {
    if (!Number.isInteger(input)) {
      this.invalidInput = true;
    } else {
      this.invalidInput = false
      if(Math.floor(this.accountBalance-input)<0) {
        this.minBalanceValid = false;
      } else {
        this.minBalanceValid = true;
      }
    }
  }

  handleOtp(otp: string) {

  }
}
