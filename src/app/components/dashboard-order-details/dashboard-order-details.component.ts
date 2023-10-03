import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/common/order';
import { ProcessOrderRequest } from 'src/app/common/process-order-request';
import { OrderService } from 'src/app/services/order.service';
import { PayPalService } from 'src/app/services/pay-pal.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-order-details',
  templateUrl: './dashboard-order-details.component.html',
  styleUrls: ['./dashboard-order-details.component.css']
})
export class DashboardOrderDetailsComponent implements OnInit {

  private currentOrderId!: number;
  order!: Order;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private paypalService: PayPalService,
  ) { }

  ngOnInit() {
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

    const subscription = this.orderService.getOrderDetailForCustomer(this.currentOrderId).subscribe(
      (order) => {
        if(order.state!=constants.ERROR_STATE){
          this.order = order;
        }
        subscription.unsubscribe();
      }
    );
  }

  convertTimeToString(time: number): string {
    let hour = Math.floor(time / 100) <= 12 ? Math.floor(time / 100) : Math.floor(time / 100) % 12;
    let min = (time % 100 == 0 ? "00" : time % 100);
    let merd = (Math.floor(time / 100) < 12 ? "AM" : "PM");

    return (hour == 0 ? "00" : hour) + ":" + min + merd;
  }

  processOrder(action: string) {
    let processOrderRequest = new ProcessOrderRequest(this.order.id, this.order.customer.id, this.order.professional.id, action, "");
    this.orderService.processOrder(processOrderRequest).subscribe(
      (response) => {
        if(response.state!=constants.ERROR_STATE) {
          this.toastr.success(response.state);
        } else {
          this.toastr.error(response.message);
        }
      }
    );
  }

  makePayment() {
    this.paypalService.makePayment(10, this.order.id).subscribe(
      (response) => {
        if(response.state==constants.SUCCESS_STATE) {
          window.location.href = response.redirect_url;
        }
      }
    );
  }

}
