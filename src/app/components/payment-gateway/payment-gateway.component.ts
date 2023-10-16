import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/services/navigation.service';
import { PayPalService } from 'src/app/services/pay-pal.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {

  redirectLink:string = "/dashboard/orderDetail/";
  orderId!: string;

  constructor(
    private route: ActivatedRoute,
    private paypalService: PayPalService,
    private toastrService: ToastrService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.navigationService.pageLoaded();
    this.route.paramMap.subscribe(()=>{
      this.loadOrderId();
    });
    this.route.queryParamMap.subscribe(()=>{
      this.processPayment();
    });
  }

  processPayment() {
    let paymentId = this.route.snapshot.queryParamMap.get("paymentId");
    let payerId = this.route.snapshot.queryParamMap.get("PayerID");

    if(payerId==null||payerId==null) {
      this.router.navigateByUrl(`${this.redirectLink}`);
    }

    const sub1 = this.paypalService.completePayment(paymentId!, payerId!).subscribe(
      (response) => {
        if(response.state==constants.SUCCESS_STATE) {
          const sub2 = this.paypalService.getPaymentDetail(paymentId!, this.orderId).subscribe(
            (response) => {
              if(response.state==constants.SUCCESS_STATE) {
                this.toastrService.success("Payment Complete!");
              }
              else {
                this.toastrService.error("Something went wrong!");
              }
              sub2.unsubscribe();
              this.router.navigateByUrl(`${this.redirectLink}`);
            }
          );
        }
        else {
          this.toastrService.error("Something went wrong!");
        }
        sub1.unsubscribe();
      }
    );
  }

  loadOrderId() {
    this.orderId = this.route.snapshot.paramMap.get("orderId")!;
    this.redirectLink = this.redirectLink+this.route.snapshot.paramMap.get("orderId");
  }

}
