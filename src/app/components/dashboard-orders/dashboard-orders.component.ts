import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Order } from 'src/app/common/order';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass, NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { DateTimeService } from 'src/app/common/services/date-time.service';

@Component({
    selector: 'app-dashboard-orders',
    templateUrl: './dashboard-orders.component.html',
    styleUrls: ['./dashboard-orders.component.css'],
    standalone: true,
    imports: [NgFor, FormsModule, NgClass, NgIf, RouterLink, DecimalPipe, DatePipe]
})
export class DashboardOrdersComponent implements OnInit {

  orders!: Order[];
  subscription: any;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private navigationService: NavigationService,
    public dateTimeService: DateTimeService
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.loadOrders();
  }

  loadOrders() {

    this.subscription = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          const subscription = this.orderService.getOrdersForCustomer(user.id).subscribe(
            (data) => {
              this.orders = data.sort((a, b)=>b.id-a.id);
              this.navigationService.pageLoaded();
              subscription.unsubscribe();
            }
          );
        }
        this.subscription.unsubscribe();
      }
    );
  }

}
