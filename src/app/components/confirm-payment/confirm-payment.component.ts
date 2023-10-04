import { Component, Input } from '@angular/core';
import { PayPalService } from 'src/app/services/pay-pal.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent {

  @Input() orderId!: number;
  @Input() amount: number=0;

  selectPaypal:boolean = false;
  checkoutClicked:boolean = false;

  constructor(
    private paypalService: PayPalService,
  ) {

  }

  makePayment() {
    if(!this.checkoutClicked) {
      this.checkoutClicked = true;
      this.paypalService.makePayment(this.amount, this.orderId).subscribe(
        (response) => {
          if(response.state==constants.SUCCESS_STATE) {
            window.location.href = response.redirect_url;
          }
        }
      );
    }
  }

}
