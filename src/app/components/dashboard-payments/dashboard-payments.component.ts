import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { PaymentAccount } from 'src/app/common/payment-account';
import { Transaction } from 'src/app/common/transaction';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { FileService } from 'src/app/services/file.service';
import { Invoice } from 'src/app/common/invoice';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-dashboard-payments',
  templateUrl: './dashboard-payments.component.html',
  styleUrls: ['./dashboard-payments.component.css']
})
export class DashboardPaymentsComponent implements OnInit {

  showWallet: boolean = true;

  paymentAccount!: PaymentAccount;
  orderTransactions: Transaction[] = [];
  walletTransactions: Transaction[] = [];
  inputEmail!: string;
  editEmail: boolean = false;

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private pdfService: FileService
  ) {

  }

  ngOnInit(): void {
    this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
    this.navigationService.showLoader();
    this.loadPaymentAccount();
  }

  toggleEditEmail() {
    this.editEmail = !this.editEmail;
  }

  addPaypalEmail() {
    const sub = this.userService.addPaypalAccount(this.inputEmail).subscribe(
      (response) => {
        if(!(response.state==constants.ERROR_STATE)) {
          window.location.reload();
        }
        sub.unsubscribe();
        this.editEmail = !this.editEmail;
      }
    );
  }

  loadPaymentAccount() {
    const sub = this.userService.getPaymentAccountByEmail(this.keycloakService.getUsername()).subscribe(
      (account) => {
        this.paymentAccount = account;
        this.orderTransactions = this.paymentAccount.transactions.filter(
          t => !t.mode.includes("wallet")
        ).sort((t1, t2) => new Date(t2.transactionDate).getTime() - new Date(t1.transactionDate).getTime());

        this.walletTransactions = this.paymentAccount.transactions.filter(
          t => t.mode.includes("wallet")
        ).sort((t1, t2) => new Date(t2.transactionDate).getTime() - new Date(t1.transactionDate).getTime());

        this.navigationService.pageLoaded();
        sub.unsubscribe();
      }
    );
  }

  generatePdf(fileName: string, invoice: Invoice) {
    this.pdfService.generatePdf(fileName, invoice);
  }

  dateToString(date: Date): string {
    let stringDate = date.toString();
    return stringDate.substring(0, stringDate.indexOf("T"));
  }

  toggleTabs() {
    this.showWallet = !this.showWallet;
  }

}
