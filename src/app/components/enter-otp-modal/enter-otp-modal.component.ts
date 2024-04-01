import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enter-otp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enter-otp-modal.component.html',
  styleUrls: ['./enter-otp-modal.component.css']
})
export class EnterOtpModalComponent {

  otpValue: string[] = ["", "", "", "", "", ""];

  @Output() OtpValueEvent = new EventEmitter<string>();

  moveToNext(i: number) {
    let nextElementSiblingId = 'otp_' + i;
    if (i < 7) {
      document.getElementById(nextElementSiblingId)!.focus();
    }
  }

  closeOtpModal() {
    this.otpValue = ["", "", "", "", "", ""];
  }

  verifyOtp() {
    let otp = this.otpValue[0] + this.otpValue[1] + this.otpValue[2] + this.otpValue[3] + this.otpValue[4] + this.otpValue[5];
    //emmit otp
    this.OtpValueEvent.emit(otp);
  }

}
