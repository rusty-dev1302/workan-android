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
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';

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
  emailSpinner: boolean = false;

  isProfessional: boolean = false;

  otpValue: string[] = ["", "", "", "", "", ""];

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor(
    private navigationService: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private pdfService: FileService,
    private toastrService: ToastrService,
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
    this.emailSpinner = true;
    const sub1 = this.dialogService.openDialog("An OTP will be sent to "+this.keycloakService.getUsername()+". Please enter it after clicking on verify to connect your email.", true).subscribe(
      (response)=> {
        if(response) {
          const sub = this.userService.addPaypalAccount(this.inputEmail).subscribe(
            (response) => {
              if (!(response.state == constants.ERROR_STATE)) {
                window.location.reload();
              }
              this.emailSpinner = false;
              sub.unsubscribe();
            }
          );
        } else {
          this.emailSpinner = false;
        }
        sub1.unsubscribe();
      }
    );
  }

  closeOtpModal() {
    this.otpValue = ["", "", "", "", "", ""];
  }

  removePaypalEmail() {
    const sub = this.userService.removePaypalAccount().subscribe(
      (response) => {
        if (!(response.state == constants.ERROR_STATE)) {
          window.location.reload();
        }
        sub.unsubscribe();
      }
    );
  }

  verifyOtp() {
    let otp = this.otpValue[0] + this.otpValue[1] + this.otpValue[2] + this.otpValue[3] + this.otpValue[4] + this.otpValue[5];
    console.log(otp);
    const sub = this.userService.verifyPaypalOtp(otp).subscribe(
      (response) => {
        if (!(response.state == constants.ERROR_STATE)) {
          window.location.reload();
        } else {
          this.toastrService.error(response.message);
        }
        sub.unsubscribe();
      }
    );

  }

  loadPaymentAccount() {
    const subscription = this.userService.getUserByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if (user.state!=constants.ERROR_STATE) {
          this.isProfessional = user.professional;
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
        subscription.unsubscribe();
      }
    );
  }

  prepareInvoiceForProfessional(fileName: string, invoice: Invoice) {
    if(this.isProfessional) {
      let sum = 0;
      invoice.breakdown.forEach(item => {
        if(item.detail==constants.AMOUNT_COLLECTED_CUSTOMER) {
          item.amount = sum;
        }
        sum = sum+item.amount;
      });
    }
    this.generatePdf(fileName, invoice);
  }

  generatePdf(fileName: string, invoice: Invoice) {
    this.pdfService.generatePdfForInvoice(fileName, invoice);
  }

  dateToString(date: Date): string {
    let stringDate = date.toString();
    return stringDate.substring(0, stringDate.indexOf("T"));
  }

  toggleTabs() {
    this.showWallet = !this.showWallet;
  }

  moveToNext(i: number) {
    let nextElementSiblingId = 'otp_' + i;
    if (i < 7) {
      document.getElementById(nextElementSiblingId)!.focus();
    }
  }

}
