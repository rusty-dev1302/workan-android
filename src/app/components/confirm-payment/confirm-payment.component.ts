import { Component, Input } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { constants } from 'src/environments/constants';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';


@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent {

  @Input() orderId!: number;
  @Input() amount: number = 0;

  paymentMode: string = "direct";
  checkoutClicked: boolean = false;
  selectedPaymentMode!: string;

  paymentOtp!: string;

  constructor(
    private paymentService: PaymentService,
    private dialogService: ConfirmationDialogService,
    private orderService: OrderService
  ) {

  }

  makePayment() {
    if (!this.checkoutClicked) {
      this.checkoutClicked = true;
      this.selectedPaymentMode = this.paymentMode;
      if (this.paymentMode == "paypal") {
        const sub = this.paymentService.makePayment(this.amount, this.orderId).subscribe(
          (response) => {
            if (response.state == constants.SUCCESS_STATE) {
              window.location.href = response.message;
            }
            sub.unsubscribe();
          }
        );
      } else {
        const sub1 = this.dialogService.openDialog("Please pay the professional directly and ask them to accept payment to complete the order.", true).subscribe(
          (response) => {
            const sub2 = this.orderService.initiateDirectPayment(this.orderId).subscribe(
              () => {
                sub2.unsubscribe();
              }
            );
            sub1.unsubscribe();
          }
        );
      }
    }
  }

}
