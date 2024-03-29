import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Order } from 'src/app/common/order';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';

@Component({
    selector: 'app-dashboard-orders-taken',
    templateUrl: './dashboard-orders-taken.component.html',
    styleUrls: ['./dashboard-orders-taken.component.css'],
    standalone: true,
    imports: [NgFor, FormsModule, NgClass, NgIf, RouterLink, DecimalPipe, DatePipe, PhonePipe, ConfirmOrderComponent]
})
export class DashboardOrdersTakenComponent {

  
  allOrders!: Order[];
  cancelledOrders!: Order[];
  subscription: any;

  selectedMenuItemsForOrder: any[]=[];
  selectedOrderId: number = 0;
  selectedAppointmentDate!: Date;
  selectedPreferredStartTimeHhmm!: number;
  selectedPreferredEndTimeHhmm!: number;

  cancelledOrdersSelected: boolean = false;


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

  prepareDataForConfirm(order: Order) {
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
  
  toggleTabs(input: boolean) {
    this.cancelledOrdersSelected = input;
  }

  loadOrders() {

    this.subscription = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          const subscription = this.orderService.getOrdersForProfessional(user.id).subscribe(
            (data) => {
              console.log(this.allOrders)
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

}
