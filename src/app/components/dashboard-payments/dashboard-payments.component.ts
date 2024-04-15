import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { Invoice } from 'src/app/common/invoice';
import { PaymentAccount } from 'src/app/common/payment-account';
import { Transaction } from 'src/app/common/transaction';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { FileService } from 'src/app/services/file.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';
import { EnterOtpModalComponent } from '../enter-otp-modal/enter-otp-modal.component';
import { AddToWalletComponent } from '../add-to-wallet/add-to-wallet.component';
import { RedeemWalletComponent } from '../redeem-wallet/redeem-wallet.component';

@Component({
    selector: 'app-dashboard-payments',
    templateUrl: './dashboard-payments.component.html',
    styleUrls: ['./dashboard-payments.component.css'],
    standalone: true,
    imports: [NgClass, NgIf, NgFor, FormsModule, DecimalPipe, DatePipe, EnterOtpModalComponent, AddToWalletComponent, RedeemWalletComponent]
})
export class DashboardPaymentsComponent implements OnInit {

  showWallet: boolean = true;

  paymentAccount!: PaymentAccount;
  orderTransactions: Transaction[] = [];
  walletTransactions: Transaction[] = [];
  inputEmail!: string;
  editEmail: boolean = false;
  emailSpinner: boolean = false;
  isRedeemFlow: boolean = true;

  isProfessional: boolean = false;

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor(
    private navigationService: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private pdfService: FileService,
    private toastrService: ToastrService,
    private paymentService: PaymentService
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
    if(this.inputEmail==null||this.inputEmail=='') {
      return
    }
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if(!regexp.test(this.inputEmail)) {
      this.toastrService.warning("Enter a valid email")
      return
    }

    // so otp model is linked with paypal flow
    this.setRedeemFlow(false);

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

  verifyOtp(otp: string) {
    if(this.isRedeemFlow) {
      this.redeemWalletConfirmOtp(otp);
    } else {
      this.verifyPaypalOtp(otp);
    }
  }

  setRedeemFlow(redeemFlow: boolean) {
    this.isRedeemFlow = redeemFlow;
  }


  verifyPaypalOtp(otp: string) {
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
          if(!this.isProfessional) {
            this.showWallet = false;
          }
          const sub = this.userService.getPaymentAccountByEmail(this.keycloakService.getUsername()).subscribe(
            (account) => {
              this.paymentAccount = account;
              this.orderTransactions = this.paymentAccount.transactions.filter(
                t => !t.mode.toLowerCase().includes("wallet")
              ).sort((t1, t2) => new Date(t2.transactionDate).getTime() - new Date(t1.transactionDate).getTime());

              this.walletTransactions = this.paymentAccount.transactions.filter(
                t => t.mode.toLowerCase().includes("wallet")
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

  initiateAddToWallet(amount: number) {
    const sub = this.paymentService.addMoneyWalletStart(amount+"", this.paymentAccount.id+"", this.isProfessional).subscribe(
      (response) => {
        if (response.state == constants.SUCCESS_STATE) {
          window.location.href = response.message;
        }
        sub.unsubscribe();
      }
    );
  }

  redeemWalletStart(amount: number) {
    this.paymentService.redeemWalletStart(amount+"", this.paymentAccount.id+"").subscribe(
      (res)=>{
        if(res.state!=constants.ERROR_STATE) {
          this.toastrService.info("Otp sent to your email")
        } else {
          this.toastrService.error(res.message);
        }
      }
    )
  }

  redeemWalletConfirmOtp(otp: string) {
    this.paymentService.redeemWalletConfirmOtp(otp, this.paymentAccount.id+"").subscribe(
      (res)=>{
        if(res.state!=constants.ERROR_STATE) {
          this.toastrService.info(res.state)
        } else {
          this.toastrService.error(res.message);
        }
        window.location.reload();
      }
    )
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

  findAbsolute(num: number) {
    return Math.abs(num);
  }

  toggleTabs(status: boolean) {
    this.showWallet = status;
  }

}
