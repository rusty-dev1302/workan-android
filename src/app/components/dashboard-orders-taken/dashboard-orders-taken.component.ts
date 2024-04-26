import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Order } from 'src/app/common/order';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { PhonePipe } from '../../pipes/phone-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-dashboard-orders-taken',
  templateUrl: './dashboard-orders-taken.component.html',
  styleUrls: ['./dashboard-orders-taken.component.css'],
  standalone: true,
  imports: [NgFor, FormsModule, NgClass, NgIf, RouterLink, DecimalPipe, DatePipe, PhonePipe, InfiniteScrollModule]
})
export class DashboardOrdersTakenComponent {

  allOrders: Order[] = [];
  subscription: any;

  pageNumber: number = 0;

  ordersStatus: string = 'ALL';


  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private navigationService: NavigationService,
    public dateTimeService: DateTimeService,
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    if (this.route.snapshot.queryParamMap.has('status')) {
      this.ordersStatus = this.route.snapshot.queryParamMap.get('status')!;
    }
    this.loadOrders();
  }

  preparePreferredDay(date: Date) {
    const strDate = this.datePipe.transform(date, 'dd MMM (EEE)', '+0000');
    return strDate;
  }

  toggleTabs(input: string) {
    this.router.navigate(['/dashboard/myorders'], { queryParams: { status: input } }).then(() => {
      window.location.reload();
    });;
  }

  loadOrders() {

    this.subscription = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if (user.state == constants.SUCCESS_STATE) {
          const subscription = this.orderService.getOrdersForProfessional(user.id, this.ordersStatus, this.pageNumber).subscribe(
            (data) => {
              if (data[0] && data[0].state != constants.ERROR_STATE) {
                this.allOrders = this.allOrders.concat(data);
                this.pageNumber++;
              } else {
                this.pageNumber = -1;
              }

              this.navigationService.pageLoaded();
              subscription.unsubscribe();
            }
          );
        }
        this.subscription.unsubscribe();
      }
    );
  }

  onScroll() {
    if(this.pageNumber!=-1) {
      this.loadOrders();
    }
  }

}
