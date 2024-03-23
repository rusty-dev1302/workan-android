import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';
import { Order } from 'src/app/common/order';
import { ProcessOrderRequest } from 'src/app/common/process-order-request';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { CancellationReasonComponent } from '../cancellation-reason/cancellation-reason.component';
import { FormsModule } from '@angular/forms';
import { NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';

@Component({
    selector: 'app-dashboard-orders-taken-details',
    templateUrl: './dashboard-orders-taken-details.component.html',
    styleUrls: ['./dashboard-orders-taken-details.component.css'],
    standalone: true,
    imports: [RouterLink, NgIf, FormsModule, CancellationReasonComponent, DecimalPipe, DatePipe, PhonePipe, ConfirmOrderComponent]
})
export class DashboardOrdersTakenDetailsComponent implements OnInit {

  private currentOrderId!: number;
  private autoRefresh!: Subscription;

  order!: Order;
  otpValue:string[] = ["","","","","",""];
  cancellationReason: any[] = constants.CANCEL_REASON_PROFESSIONAL;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.route.paramMap.subscribe(()=>{
      this.handleOrderRouting();
    });
    this.autoRefresh = interval(5000).subscribe(
      (val) => { 
        if(this.order&&this.order.status!="CANCELLED"&&this.order.status!="COMPLETED") {
          this.loadOrderDetails();
        }
      });
  }

  handleOrderRouting() {
    if(this.route.snapshot.paramMap.has("id")) {
      this.currentOrderId = +this.route.snapshot.paramMap.get("id")!;
      this.loadOrderDetails();
    }
  }

  loadOrderDetails() {
    const subscription = this.orderService.getOrderDetailForProfessional(this.currentOrderId).subscribe(
      (order) => {
        if(order.state!=constants.ERROR_STATE){
          this.order = order;
        } else {
          this.router.navigateByUrl(`/dashboard/orders`);
        }

        this.navigationService.pageLoaded();
        subscription.unsubscribe();
      }
    );
  }

  moveToNext(i:number) {
    let nextElementSiblingId = 'otp_'+ i;
        if (i<7) {
         document.getElementById(nextElementSiblingId)!.focus();
        }  
}

  convertTimeToString(time: number): string {
    if(!time) {
      return "--";
    }
    let hour = Math.floor(time / 100) <= 12 ? Math.floor(time / 100) : Math.floor(time / 100) % 12;
    let min = (time % 100 == 0 ? "00" : time % 100);
    let merd = (Math.floor(time / 100) < 12 ? "AM" : "PM");

    return (hour == 0 ? "00" : hour) + ":" + min + merd;
  }

  processOrder(action: string, cancellationReason:string="") {
    let otp = this.otpValue[0]+this.otpValue[1]+this.otpValue[2]+this.otpValue[3]+this.otpValue[4]+this.otpValue[5];
    let processOrderRequest = new ProcessOrderRequest(this.order.id, null, this.order.professional.id, action, otp, cancellationReason);
    const sub = this.orderService.processOrder(processOrderRequest).subscribe(
      (response) => {
        if(response.state!=constants.ERROR_STATE) {
          this.toastr.success(response.state);
          window.location.reload();
        } else {
          this.toastr.error(response.message);
        }
        sub.unsubscribe();
      }
    );
  }

  confirmOrder() {
    
  }

  confirmDirectPayment() {
    const sub = this.paymentService.confirmDirectPayment(this.order.id).subscribe(
      (response) => {
        if(response.state==constants.SUCCESS_STATE) {
          this.toastr.success("Payment Successful");
        } else {
          this.toastr.error(response.message);
        }
        window.location.reload();
        sub.unsubscribe();
      }
    );
  }

  cancelOrder(cancellationReason:any) {
    this.processOrder("CANCEL", cancellationReason.reason);
  }

}
