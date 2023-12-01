import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { PaymentAccount } from 'src/app/common/payment-account';
import { Transaction } from 'src/app/common/transaction';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";

@Component({
  selector: 'app-dashboard-payments',
  templateUrl: './dashboard-payments.component.html',
  styleUrls: ['./dashboard-payments.component.css']
})
export class DashboardPaymentsComponent implements OnInit {

  paymentAccount!: PaymentAccount;
  orderTransactions: Transaction[] = [];
  walletTransactions: Transaction[] = [];

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {

  }

  ngOnInit(): void {
    this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
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

  generatePdf() {
    const data = [    ['Name', 'Email', 'Country'],
      ['John Doe', 'johndoe@example.com', 'USA'],
      ['Jane Smith', 'janesmith@example.com', 'Canada'],
      ['Bob Johnson', 'bobjohnson@example.com', 'UK']
    ];
  
    const docDefinition = {
      content: [
        { text: 'User Data', style: 'header' },
        { table: { body: data } }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };
  
    this.pdfMake.createPdf(docDefinition).download('userdata.pdf');
  }
}
