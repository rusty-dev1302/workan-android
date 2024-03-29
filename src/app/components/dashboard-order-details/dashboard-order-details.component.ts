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
import { ConfirmPaymentComponent } from '../confirm-payment/confirm-payment.component';
import { CancellationReasonComponent } from '../cancellation-reason/cancellation-reason.component';
import { ReviewComponent } from '../review/review.component';
import { FormsModule } from '@angular/forms';
import { NgIf, DecimalPipe, DatePipe, NgFor } from '@angular/common';
import { CustomerOrder } from 'src/app/common/customer-order';
import { DateTimeService } from 'src/app/common/services/date-time.service';

@Component({
    selector: 'app-dashboard-order-details',
    templateUrl: './dashboard-order-details.component.html',
    styleUrls: ['./dashboard-order-details.component.css'],
    standalone: true,
    imports: [RouterLink, NgIf, NgFor, FormsModule, ReviewComponent, CancellationReasonComponent, ConfirmPaymentComponent, DecimalPipe, DatePipe, PhonePipe]
})
export class DashboardOrderDetailsComponent implements OnInit {

  private currentOrderId!: number;
  private autoRefresh!: Subscription;

  order!: CustomerOrder;
  cancellationReason = constants.CANCEL_REASON_CUSTOMER;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private router: Router,
    public dateTimeService: DateTimeService
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

    const subscription = this.orderService.getOrderDetailForCustomer(this.currentOrderId).subscribe(
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

  processOrder(action: string, cancellationReason:string="") {
    let processOrderRequest = new ProcessOrderRequest(this.order.id, this.order.customer.id, this.order.professional.id, action,"", cancellationReason);
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

  cancelOrder(cancellationReason:any) {
    this.processOrder("CANCEL", cancellationReason.reason);
  }

}
