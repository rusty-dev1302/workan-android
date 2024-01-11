import { Component, Input } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
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
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private orderService: OrderService
  ) {

  }

  makePayment() {
    if(!this.checkoutClicked) {
      this.checkoutClicked = true;
      this.selectedPaymentMode = this.paymentMode;
      if(this.paymentMode=="paypal") {
        const sub = this.paymentService.makePayment(this.amount, this.orderId).subscribe(
          (response) => {
            if(response.state==constants.SUCCESS_STATE) {
              window.location.href = response.message;
            }
            sub.unsubscribe();
          }
        );
      } else {
        const sub = this.orderService.getPaymentOtp(this.orderId).subscribe(
          (response) => {
            if(response.state==constants.SUCCESS_STATE) {
              this.paymentOtp = response.message;
              this.toastrService.info("Payment OTP generated.")
            } else {
              this.toastrService.info("OTP not generated.")
            }
            sub.unsubscribe();
          }
        );

      }
    }
  }

}
