import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';
import { CustomerOrder } from 'src/app/common/customer-order';
import { ProcessOrderRequest } from 'src/app/common/process-order-request';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { CancellationReasonComponent } from '../cancellation-reason/cancellation-reason.component';
import { ConfirmPaymentComponent } from '../confirm-payment/confirm-payment.component';
import { ReviewComponent } from '../review/review.component';

@Component({
    selector: 'app-dashboard-order-details',
    templateUrl: './dashboard-order-details.component.html',
    styleUrls: ['./dashboard-order-details.component.css'],
    standalone: true,
    imports: [RouterLink, NgClass, NgIf, NgFor, FormsModule, ReviewComponent, CancellationReasonComponent, ConfirmPaymentComponent, DecimalPipe, DatePipe, PhonePipe]
})
export class DashboardOrderDetailsComponent implements OnInit {

  private currentOrderId!: number;
  private autoRefresh!: Subscription;

  dateToday!: Date;

  order!: CustomerOrder;
  cancellationReason = constants.CANCEL_REASON_CUSTOMER;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private router: Router,
    private navigation: NavigationService,
    public dateTimeService: DateTimeService,
    public datePipe: DatePipe
  ) { }


  ngOnInit() {
    this.dateToday = this.dateTimeService.truncateTimezone(new Date);
    console.log(this.datePipe.transform(this.dateToday, 'yyyy-MM-dd'))

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
          console.log(this.datePipe.transform(this.order.appointmentDate, 'yyyy-MM-dd', '+0000'))

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

  navigateBack(): void {
    this.navigation.back()
  }

}
