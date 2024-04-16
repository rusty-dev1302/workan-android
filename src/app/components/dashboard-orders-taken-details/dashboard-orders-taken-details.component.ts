import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';
import { Order } from 'src/app/common/order';
import { ProcessOrderRequest } from 'src/app/common/process-order-request';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { CancellationReasonComponent } from '../cancellation-reason/cancellation-reason.component';
import { EnterOtpModalComponent } from '../enter-otp-modal/enter-otp-modal.component';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';

@Component({
    selector: 'app-dashboard-orders-taken-details',
    templateUrl: './dashboard-orders-taken-details.component.html',
    styleUrls: ['./dashboard-orders-taken-details.component.css'],
    standalone: true,
    imports: [RouterLink, NgIf, NgClass, NgFor, FormsModule, CancellationReasonComponent, DecimalPipe, DatePipe, PhonePipe, EnterOtpModalComponent, ConfirmOrderComponent]
})
export class DashboardOrdersTakenDetailsComponent implements OnInit {

  private currentOrderId!: number;
  private autoRefresh!: Subscription;
  lowBalance:boolean = false;

  selectedMenuItemsForOrder: any[]=[];
  selectedOrderId: number = 0;
  selectedAppointmentDate!: Date;
  selectedPreferredStartTimeHhmm!: number;
  selectedPreferredEndTimeHhmm!: number;

  order!: any;
  cancellationReason: any[] = constants.CANCEL_REASON_PROFESSIONAL;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private paymentService: PaymentService,
    private router: Router,
    public dateTimeService: DateTimeService,
    private navigation: NavigationService
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

          if(this.order.professionalBalance<=0) {
            this.lowBalance = true;
          }

        } else {
          this.router.navigateByUrl(`/dashboard/orders`);
        }

        this.navigationService.pageLoaded();
        subscription.unsubscribe();
      }
    );
  }

  handleOtp(otp: string) {
    if(this.order.status=='STARTING') {
      this.processOrder('START', otp);
    }
  }

  prepareDataForConfirm(order: Order) {
    if(this.lowBalance) {
      this.toastr.warning("Please add money to wallet to accept more orders")
      return;
    }
    this.selectedAppointmentDate = order.appointmentDate;
    this.selectedPreferredStartTimeHhmm = order.preferredStartTimeHhmm;
    this.selectedPreferredEndTimeHhmm = order.preferredEndTimeHhmm;

    this.selectedOrderId = order.id;
    this.selectedMenuItemsForOrder = [];
    const sub = this.orderService.getMenuItemsForOrder(order.id).subscribe(
      (data)=>{
        this.selectedMenuItemsForOrder = data;
        sub.unsubscribe();
      }
    );
  }

  processOrder(action: string, otp: string, cancellationReason:string="") {
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
    this.processOrder("CANCEL","", cancellationReason.reason);
  }

  navigateBack(): void {
    this.navigation.back()
  }

}
