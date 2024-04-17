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
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-dashboard-orders-taken',
    templateUrl: './dashboard-orders-taken.component.html',
    styleUrls: ['./dashboard-orders-taken.component.css'],
    standalone: true,
    imports: [NgFor, FormsModule, NgClass, NgIf, RouterLink, DecimalPipe, DatePipe, PhonePipe]
})
export class DashboardOrdersTakenComponent {

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
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.navigationService.showLoader();
    if(this.route.snapshot.queryParamMap.has('cancelledSelected')) {
      this.cancelledOrdersSelected = this.route.snapshot.queryParamMap.get('cancelledSelected') ? this.route.snapshot.queryParamMap.get('cancelledSelected')=='true'! : false;
    }
    this.loadOrders();
  }

  preparePreferredDay(date: Date) {
    const strDate = this.datePipe.transform(date, 'dd MMM (EEE)', '+0000');
    return strDate;
  }
  
  toggleTabs(input: boolean) {
    this.router.navigate(['/dashboard/myorders'], { queryParams: {cancelledSelected:input} }).then(() => {
      window.location.reload();
    });;
  }

  loadOrders() {

    this.subscription = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if(user.state==constants.SUCCESS_STATE) {
          const subscription = this.orderService.getOrdersForProfessional(user.id).subscribe(
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

  getGroupDate() {
    return "hello"
  }

}
