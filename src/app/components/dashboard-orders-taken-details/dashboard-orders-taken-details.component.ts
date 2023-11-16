import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/common/order';
import { ProcessOrderRequest } from 'src/app/common/process-order-request';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-orders-taken-details',
  templateUrl: './dashboard-orders-taken-details.component.html',
  styleUrls: ['./dashboard-orders-taken-details.component.css']
})
export class DashboardOrdersTakenDetailsComponent implements OnInit {

  private currentOrderId!: number;
  order!: Order;
  otpValue:string[] = ["","","","","",""]

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.route.paramMap.subscribe(()=>{
      this.handleOrderRouting();
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
    let hour = Math.floor(time / 100) <= 12 ? Math.floor(time / 100) : Math.floor(time / 100) % 12;
    let min = (time % 100 == 0 ? "00" : time % 100);
    let merd = (Math.floor(time / 100) < 12 ? "AM" : "PM");

    return (hour == 0 ? "00" : hour) + ":" + min + merd;
  }

  processOrder(action: string) {
    let otp = this.otpValue[0]+this.otpValue[1]+this.otpValue[2]+this.otpValue[3]+this.otpValue[4]+this.otpValue[5];
    let processOrderRequest = new ProcessOrderRequest(this.order.id, null, this.order.professional.id, action, otp);
    this.orderService.processOrder(processOrderRequest).subscribe(
      (response) => {
        if(response.state!=constants.ERROR_STATE) {
          this.toastr.success(response.state);
          window.location.reload();
        } else {
          this.toastr.error(response.message);
        }
      }
    );
  }

  confirmDirectPayment() {
    let otp = this.otpValue[0]+this.otpValue[1]+this.otpValue[2]+this.otpValue[3]+this.otpValue[4]+this.otpValue[5];
    this.orderService.confirmDirectPayment(this.order.id, otp).subscribe(
      (response) => {
        if(response.state==constants.SUCCESS_STATE) {
          window.location.reload();
        } else {
          this.toastr.error(response.message);
        }
      }
    );
  }

}
