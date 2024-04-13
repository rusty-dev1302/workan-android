import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/services/navigation.service';
import { constants } from 'src/environments/constants';
import { UserService } from 'src/app/services/user.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-process-add-to-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-add-to-wallet.component.html',
  styleUrls: ['./process-add-to-wallet.component.css']
})
export class ProcessAddToWalletComponent implements OnInit, OnDestroy {

  redirectLink: string = "/dashboard/";
  paymentAccountId!: string;

  subscription!:any;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private toastrService: ToastrService,
    private router: Router,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.navigationService.pageLoaded();
    this.route.paramMap.subscribe(() => {
      this.loadAccountInfo();
    });
    this.subscription = this.route.queryParamMap.subscribe(() => {
      this.processPayment();
    });
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  processPayment() {

    const sub = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        if (user.state == constants.SUCCESS_STATE) {
          //change redirect url depending on professional/customer
          this.redirectLink = user.professional ? this.redirectLink + "professionalPayments" : this.redirectLink + "payments";

          // complete payment 
          let paymentId = this.route.snapshot.queryParamMap.get("paymentId");
          let payerId = this.route.snapshot.queryParamMap.get("PayerID");

          if (payerId == null || payerId == null) {
            this.router.navigateByUrl(`${this.redirectLink}`);
          }

          const sub1 = this.paymentService.addMoneyWalletComplete(paymentId!, payerId!, this.paymentAccountId).subscribe(
            (response) => {
              if (response.state != constants.SUCCESS_STATE) {
                this.toastrService.error("Something went wrong!");
              }
              this.router.navigateByUrl(`${this.redirectLink}`);
              sub1.unsubscribe();
            }
          );


          sub.unsubscribe();
        }
      }
    );
  }

  loadAccountInfo() {
    this.paymentAccountId = this.route.snapshot.paramMap.get("paymentAccountId")!;
  }

}
