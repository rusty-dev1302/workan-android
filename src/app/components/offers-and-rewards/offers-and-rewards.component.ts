import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { DateTimeService } from 'src/app/common/services/date-time.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-offers-and-rewards',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './offers-and-rewards.component.html',
  styleUrls: ['./offers-and-rewards.component.css']
})
export class OffersAndRewardsComponent implements OnInit {

  user!: any;
  referralCode!: any;
  inputCode: string = "";

  codeVisible: boolean = false;

  monthStartList: Date[] = [];

  currentMonthStart!: Date;

  completedOrders: number = 0;

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private toastr: ToastrService,
    private dateTimeService: DateTimeService
  ) {

  }

  createMonths() {
    for (let i = 0; i < 12; i++) {
      let date = new Date();
      date.setMonth(date.getMonth()-i);
      date.setDate(1);
      this.monthStartList.push(date);
    }
  }

  ngOnInit(): void {
    this.currentMonthStart = new Date();
    this.currentMonthStart.setDate(1);

    const sub = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        this.user = user;
        this.navigationService.pageLoaded();
        if (!this.user.professional) {
          this.getReferralCodeInfo();
        } else {
          this.getCompletedOrdersInfo();
        }
        sub.unsubscribe();
      }
    );

    this.createMonths();
  }

  viewEditCode(input: boolean) {
    this.codeVisible = input;
  }

  applyCode() {
    const sub = this.userService.linkUserToReferralCode(this.inputCode).subscribe(
      (res) => {
        if (res.state == constants.ERROR_STATE) {
          this.toastr.warning(res.message);
        } else {
          window.location.reload();
          this.toastr.success(res.state);
        }
        sub.unsubscribe();
      }
    );
    this.viewEditCode(false);
  }

  copyCode() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.referralCode.code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.info("Copied to Clipboard")
  }

  getReferralCodeInfo() {
    const sub = this.userService.getReferralCodeInfo().subscribe(
      (code) => {
        if (code.state != constants.ERROR_STATE) {
          this.referralCode = code;
        }

        sub.unsubscribe();
      }
    );
  }

  selectMonth(date: Date) {
    this.currentMonthStart = date;
    this.getCompletedOrdersInfo();
  }

  getCompletedOrdersInfo() {
    const sub = this.userService.getCompletedOrdersInfo(this.dateTimeService.truncateTimezone(this.currentMonthStart)).subscribe(
      (numOrders) => {

        this.completedOrders = numOrders;

        sub.unsubscribe();
      }
    );
  }

}
