import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { PaymentAccount } from 'src/app/common/payment-account';
import { Transaction } from 'src/app/common/transaction';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard-payments',
  templateUrl: './dashboard-payments.component.html',
  styleUrls: ['./dashboard-payments.component.css']
})
export class DashboardPaymentsComponent implements OnInit {

  paymentAccount!: PaymentAccount;
  orderTransactions: Transaction[] = [];
  walletTransactions: Transaction[] = [];

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
        this.paymentAccount = account;
        this.orderTransactions = this.paymentAccount.transactions.filter(
          t => !t.mode.includes("wallet")
        );
        this.walletTransactions = this.paymentAccount.transactions.filter(
          t => t.mode.includes("wallet")
        );
        this.navigationService.pageLoaded();
        sub.unsubscribe();
      }
    );
  }

}
