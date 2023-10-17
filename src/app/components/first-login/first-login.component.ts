import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/common/customer';
import { NavigationService } from 'src/app/services/navigation.service';
import { UserService } from 'src/app/services/user.service';
import { constants } from 'src/environments/constants';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent implements OnInit{
  
  isProfessional: boolean =  false;
  isFirstLogin: boolean = false;
  user: Customer = constants.DEFAULT_CUSTOMER;
  subscription!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService
    ) {}

  ngOnInit(): void {
    this.navigationService.showLoader();
    this.subscription = this.userService.getIsFirstLogin().subscribe(
      (isFirstLogin) => {
        this.isFirstLogin = isFirstLogin;
        if(!this.isFirstLogin) {
          this.router.navigateByUrl(`/dashboard/profile`);
        }
        this.navigationService.pageLoaded();
      }
    );
    this.userService.updateFirstLogin();
   }

   setAccountType(type: string) {
    if(type=='GENERAL'){
      this.isProfessional = false;
    }
    if(type=='PROFESSIONAL'){
      this.isProfessional = true;
    }
   }

   submitAccountType() {
    this.user.professional = this.isProfessional;
    const userProfileSubscription = this.userService.getCurrentUserProfile().subscribe(
      (userProfile) => {
        if(userProfile) {
          this.user.email = userProfile.email!;
          this.user.firstName = userProfile.firstName!;
          this.user.lastName = userProfile.lastName!;
        }
        userProfileSubscription.unsubscribe();
      }
    );
    const subscription = this.userService.saveUserData(this.user).subscribe(
      (data)=>{
        if(data.state==constants.SUCCESS_STATE) {
          this.userService.updateFirstLogin();
          this.router.navigateByUrl(`/dashboard/profile`);
        }
        subscription.unsubscribe();
      });
   }

   ngOnDestroy() {
    this.subscription.unsubscribe();
   }
}
