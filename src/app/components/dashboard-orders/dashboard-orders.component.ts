import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    if(this.route.snapshot.queryParamMap.has('cancelledSelected')) {
      this.cancelledOrdersSelected = this.route.snapshot.queryParamMap.get('cancelledSelected') ? this.route.snapshot.queryParamMap.get('cancelledSelected')=='true'! : false;
    }
    this.loadOrders();
  }

  loadOrders() {

    this.subscription = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
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
    this.router.navigate(['/dashboard/orders'], { queryParams: {cancelledSelected:input} }).then(() => {
      window.location.reload();
    });;
  }

}
