import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/common/order';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
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
    private orderService: OrderService
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
    console.log("Got param map")

    const subscription = this.orderService.getOrderDetailForCustomer(this.currentOrderId).subscribe(
      (order) => {
        if(order.state!=constants.ERROR_STATE){
          this.order = order;
          console.log("Order "+order)
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

}
