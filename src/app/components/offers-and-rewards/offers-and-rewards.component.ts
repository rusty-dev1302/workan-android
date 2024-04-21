import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { KeycloakService } from 'keycloak-angular';
import { constants } from 'src/environments/constants';
import { Customer } from 'src/app/common/customer';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offers-and-rewards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers-and-rewards.component.html',
  styleUrls: ['./offers-and-rewards.component.css']
})
export class OffersAndRewardsComponent implements OnInit{

  user!: any;
  referralCode!: any;
  inputCode: string = "";

  codeVisible: boolean = false;

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    const sub = this.userService.getUserShortByEmail(this.keycloakService.getUsername()).subscribe(
      (user) => {
        this.user = user;
        this.navigationService.pageLoaded();
        if(!this.user.professional) {
          this.getReferralCodeInfo();
        }
        console.log(JSON.stringify(user))
        sub.unsubscribe();
      }
    );
  
  }

  viewEditCode(input: boolean) {
    this.codeVisible = input;
  }

  applyCode() {
    console.log("hello")
    const sub = this.userService.linkUserToReferralCode(this.inputCode).subscribe(
      (res) => {
        if(res.state==constants.ERROR_STATE) {
          this.toastr.warning(res.message);
        } else {
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
        if(code.state!=constants.ERROR_STATE) {
          this.referralCode = code;
        }

        sub.unsubscribe();
      }
    );
  }



}
