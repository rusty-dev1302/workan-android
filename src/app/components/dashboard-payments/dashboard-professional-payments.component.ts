import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { PaymentAccount } from 'src/app/common/payment-account';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard-payments',
  templateUrl: './dashboard-payments.component.html',
  styleUrls: ['./dashboard-payments.component.css']
})
export class DashboardPaymentsComponent implements OnInit {

  paymentAccount!: PaymentAccount;

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {

  }

  ngOnInit(): void {
    this.navigationService.showLoader();
    this.loadPaymentAccount();
  }

  loadPaymentAccount() {
    const sub = this.userService.getPaymentAccountByEmail(this.keycloakService.getUsername()).subscribe(
      (account)=> {
        console.log(JSON.stringify(account))
        this.paymentAccount = account;
        this.navigationService.pageLoaded();
        sub.unsubscribe();
      }
    );
  }

}
