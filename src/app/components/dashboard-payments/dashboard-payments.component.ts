import { CommonModule, DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { interval } from 'rxjs';

@Component({
    selector: 'app-dashboard-payments',
    templateUrl: './dashboard-payments.component.html',
    styleUrls: ['./dashboard-payments.component.css'],
    standalone: true,
    imports: [NgClass, NgIf, NgFor, FormsModule, DecimalPipe, DatePipe, EnterOtpModalComponent, AddToWalletComponent, RedeemWalletComponent, CommonModule, InfiniteScrollModule]
})
export class DashboardPaymentsComponent implements OnInit {

  showWallet: boolean = true;

  monthStartList: Date[] = [];

  currentMonthStart!: Date;

  paymentAccount!: PaymentAccount;
  orderTransactions: Transaction[] = [];
  walletTransactions: Transaction[] = [];
  inputEmail!: string;
  editEmail: boolean = false;
  emailSpinner: boolean = false;
  isRedeemFlow: boolean = true;

  isProfessional: boolean = false;

  orderPageNumber: number = 0;
  walletPageNumber: number = 0;

  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');

  constructor(
    private navigationService: NavigationService,
    private dialogService: ConfirmationDialogService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private pdfService: FileService,
    private toastrService: ToastrService,
    private paymentService: PaymentService,
    public datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.pdfMake.vfs = this.pdfFonts.pdfMake.vfs;
    this.navigationService.showLoader();
    this.currentMonthStart = new Date();
    this.currentMonthStart.setDate(1);
    this.loadPaymentAccount();
    this.createMonths();
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
    const sub1 = this.dialogService.openDialog("An OTP will be sent to "+this.keycloakService.getUsername()+".<br> Please enter it after clicking on verify to connect your email.", true, true).subscribe(
      (response)=> {
        if(response) {
          this.inputEmail = this.inputEmail.toLowerCase().trim();
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

              if(this.showWallet) {
                this.loadWalletTransactions();
              } else {
                this.loadOrderTransactions();
              }

              this.navigationService.pageLoaded();
              sub.unsubscribe();
            }
          );
        }
        subscription.unsubscribe();
      }
    );
  }

  loadWalletTransactions(pageNumber: number = 0) {
    const sub1 = this.userService.getPaymentTransactions(this.currentMonthStart, 'wallet', pageNumber).subscribe(
      (transactions) => {
        if(pageNumber==0) {
          this.walletTransactions = transactions;
        } else {
          this.walletTransactions = this.walletTransactions.concat(transactions);
        }
        if(transactions.length==0) {
          this.walletPageNumber = -1;
        }
        sub1.unsubscribe();
      }
    );
  }

  loadOrderTransactions(pageNumber: number = 0) {
    const sub1 = this.userService.getPaymentTransactions(this.currentMonthStart, 'direct,paypal', pageNumber).subscribe(
      (transactions) => {
        if(pageNumber==0) {
          this.orderTransactions = transactions;
        } else {
          this.orderTransactions = this.orderTransactions.concat(transactions);
        }
        if(transactions.length==0) {
          this.orderPageNumber = -1;
        }
        sub1.unsubscribe();
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
          this.toastrService.info("Otp sent to your email.")
        } else {
          this.toastrService.error(res.message);
          interval(2000).subscribe(
            ()=>{
              window.location.reload();
            }
          );
        }
      }
    )
  }

  redeemWalletConfirmOtp(otp: string) {
    this.paymentService.redeemWalletConfirmOtp(otp, this.paymentAccount.id+"").subscribe(
      (res)=>{
        if(res.state!=constants.ERROR_STATE) {
          this.toastrService.info(res.state);
        } else {
          this.toastrService.error(res.message);
        }
        interval(2000).subscribe(
          ()=>{
            window.location.reload();
          }
        );
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

  findAbsolute(num: number) {
    return Math.abs(num);
  }

  toggleTabs(status: boolean) {
    this.showWallet = status;
    this.currentMonthStart = this.monthStartList[0];
    
    if(this.showWallet) {
      this.walletPageNumber = 0;
      this.loadWalletTransactions();
    } else {
      this.orderPageNumber = 0;
      this.loadOrderTransactions();
    }
  }

  createMonths() {
    for (let i = 0; i < 12; i++) {
      let date = new Date();
      date.setMonth(date.getMonth()-i);
      date.setDate(1);
      this.monthStartList.push(date);
    }
  }

  selectMonth(date: Date) {
    this.currentMonthStart = date;
    if(this.showWallet) {
      this.walletPageNumber = 0;
      this.loadWalletTransactions();
    } else {
      this.orderPageNumber = 0;
      this.loadOrderTransactions();
    }
  }

  onScroll() {
    if (this.showWallet) {
      if(this.walletPageNumber>-1) {
        this.loadWalletTransactions(this.walletPageNumber++);
      }
    } else {
      if(this.orderPageNumber>-1) {
        this.loadOrderTransactions(this.orderPageNumber++);
      }
    }
  }

}
