import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayPalService } from 'src/app/services/pay-pal.service';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private paypalService: PayPalService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(()=>{
      this.processPayment();
    });
  }

  processPayment() {
    let paymentId = this.route.snapshot.queryParamMap.get("paymentId");
    let payerId = this.route.snapshot.queryParamMap.get("PayerID");
    this.paypalService.completePayment(paymentId!, payerId!).subscribe(
      (response) => {
        console.log("response: "+JSON.stringify(response));
      }
    );
  }

}
