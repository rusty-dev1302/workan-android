import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { constants } from 'src/environments/constants';


@Component({
    selector: 'app-confirm-payment',
    templateUrl: './confirm-payment.component.html',
    styleUrls: ['./confirm-payment.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, DecimalPipe]
})
export class ConfirmPaymentComponent implements OnInit{

  @Input() orderId!: number;
  @Input() amount: number = 0;

  paymentMode: string = "direct";
  checkoutClicked: boolean = false;
  selectedPaymentMode!: string;
  invoice!: any;

  paymentOtp!: string;

  constructor(
    private paymentService: PaymentService,
    private dialogService: ConfirmationDialogService,
    private orderService: OrderService,
    private invoiceService: InvoiceService
  ) {

  }

  ngOnInit(): void {
    this.getInvoice("direct");
  }

  getInvoice(mode: string) {
    const sub = this.invoiceService.createInvoice(this.orderId, mode).subscribe(
      (response) => {
        this.invoice = response;
        sub.unsubscribe();
      }
    );
  }

  makePayment() {
    if (!this.checkoutClicked) {
      this.checkoutClicked = true;
      this.selectedPaymentMode = this.paymentMode;
      if (this.paymentMode == "paypal") {
        const sub = this.paymentService.makePayment(this.invoice.totalAmount, this.orderId).subscribe(
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
