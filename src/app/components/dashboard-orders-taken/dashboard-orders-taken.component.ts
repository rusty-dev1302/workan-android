import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Order } from 'src/app/common/order';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-orders-taken',
  templateUrl: './dashboard-orders-taken.component.html',
  styleUrls: ['./dashboard-orders-taken.component.css']
})
export class DashboardOrdersTakenComponent {

  
  orders!: Order[];
  subscription: any;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.loadOrders();
  }

  loadOrders() {

    this.subscription = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          const subscription = this.orderService.getOrdersForProfessional(user.id).subscribe(
            (data) => {
              this.orders = data.sort((a, b)=>b.id-a.id);

              this.navigationService.pageLoaded();
              subscription.unsubscribe();
            }
          );
        }
      }
    );
  }

  convertTimeToString(time: number): string{
    let hour = Math.floor(time/100)<=12?Math.floor(time/100):Math.floor(time/100)%12;
    let min = (time%100==0?"00":time%100);
    let merd = (Math.floor(time/100)<12?"AM":"PM");

    return (hour==0?"00":hour)+":"+min+merd;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
