import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { CreateOrderRequest } from 'src/app/common/create-order-request';
import { Order } from 'src/app/common/order';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-orders',
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.css'],
  standalone: true,
  imports: [NgFor, FormsModule, NgClass, NgIf, RouterLink, DecimalPipe, DatePipe]
})
export class DashboardOrdersComponent implements OnInit {

  allOrders!: Order[];
  cancelledOrders!: Order[];
  subscription: any;
  cancelledOrdersSelected: boolean = false;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private navigationService: NavigationService,
    public dateTimeService: DateTimeService,
    private dialogService: ConfirmationDialogService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    this.loadOrders();
  }

  confirmOrderAppointment(orderId: number) {
    const subs = this.dialogService.openDialog(" confirm appointment for the date and time").subscribe(
      (res) => {
        if (res) {
          const sub = this.orderService.confirmOrderAppointment(orderId, 0, new CreateOrderRequest(null!, null!, null!, null!, null!, null!)).subscribe(
            (response) => {
              if(response.state==constants.ERROR_STATE) {
                this.toastr.error(response.message);
              }
              this.loadOrders();
              sub.unsubscribe();
            }
          );
        }
        subs.unsubscribe();
      }
    );
  }

  loadOrders() {

    this.subscription = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if (user.state == constants.SUCCESS_STATE) {
          const subscription = this.orderService.getOrdersForCustomer(user.id).subscribe(
            (data) => {
              this.allOrders = data.filter((order)=>order.status!='CANCELLED').sort((a, b)=>b.appointmentDate > a.appointmentDate?1:-1);
              this.cancelledOrders = data.filter((order)=>order.status=='CANCELLED').sort((a, b)=>b.appointmentDate > a.appointmentDate?1:-1);
 
              this.navigationService.pageLoaded();
              subscription.unsubscribe();
            }
          );
        }
        this.subscription.unsubscribe();
      }
    );
  }

  toggleTabs(input: boolean) {
    this.cancelledOrdersSelected = input;
  }

}
