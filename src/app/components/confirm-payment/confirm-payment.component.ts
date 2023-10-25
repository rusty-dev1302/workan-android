import { Component, Input } from '@angular/core';
import { PayPalService } from 'src/app/services/pay-pal.service';
import { constants } from 'src/environments/constants';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent {

  @Input() orderId!: number;
  @Input() amount: number=0;

  paymentMode:string = "direct";
  checkoutClicked:boolean = false;
  selectedPaymentMode!:string;

  paymentOtp!:string;

  constructor(
    private paypalService: PayPalService,
    private toastrService: ToastrService,
    private orderService: OrderService
  ) {

  }

  makePayment() {
    console.log(this.paymentMode)
    if(!this.checkoutClicked) {
      this.checkoutClicked = true;
      this.selectedPaymentMode = this.paymentMode;
      if(this.paymentMode=="paypal") {
        this.paypalService.makePayment(this.amount, this.orderId).subscribe(
          (response) => {
            if(response.state==constants.SUCCESS_STATE) {
              window.location.href = response.redirect_url;
            }
          }
        );
      } else {
        this.paymentOtp = "12345"
        this.toastrService.info("Payment OTP generated!")
      }
    }
  }

}
