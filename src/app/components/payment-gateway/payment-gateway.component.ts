import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';
import { constants } from 'src/environments/constants';

@Component({
    selector: 'app-payment-gateway',
    templateUrl: './payment-gateway.component.html',
    styleUrls: ['./payment-gateway.component.css'],
    standalone: true
})
export class PaymentGatewayComponent implements OnInit, OnDestroy {

  redirectLink:string = "/dashboard/orderDetail/";
  orderId!: string;

  subscription!:any;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.navigationService.pageLoaded();
    this.route.paramMap.subscribe(()=>{
      this.loadOrderId();
    });
    this.subscription = this.route.queryParamMap.subscribe(()=>{
      this.processPayment();
    });
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  processPayment() {
    let paymentId = this.route.snapshot.queryParamMap.get("paymentId");
    let payerId = this.route.snapshot.queryParamMap.get("PayerID");

    if(payerId==null||payerId==null) {
      this.router.navigateByUrl(`${this.redirectLink}`);
    }

    const sub1 = this.paymentService.completePayment(paymentId!, payerId!, this.orderId).subscribe(
      (response) => {
        if(response.state!=constants.SUCCESS_STATE){
          this.toastrService.error("Something went wrong!");
        }
        this.router.navigateByUrl(`${this.redirectLink}`);
        sub1.unsubscribe();
      }
    );
  }

  loadOrderId() {
    this.orderId = this.route.snapshot.paramMap.get("orderId")!;
    this.redirectLink = this.redirectLink+this.route.snapshot.paramMap.get("orderId");
  }

}
