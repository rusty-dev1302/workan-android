import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService} from 'keycloak-angular';
import { interval } from 'rxjs';
import { PushNotification } from 'src/app/common/push-notification';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input()
  isAuthenticated: boolean = false;

  isFirstLogin: boolean = false;

  notificationCount: string = "0";

  notifications: PushNotification[] = [];

  showLoader: boolean = false;


  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.userService.getIsFirstLogin().subscribe(
      (isFirstLogin) => {
        this.isFirstLogin = isFirstLogin;
        if(this.isFirstLogin) {
          this.router.navigateByUrl(`/firstLogin`);
        } else {
          // already registered user 
          this.longPollNewNotification();
        }
      }
    );
    this.userService.updateFirstLogin();
  }

  getNotificationsForUser() {
    this.showLoader = true;
    this.checkForNewNotification(true);
    this.notificationService.getNotificationsForUser().subscribe(
      (data) => {
        this.showLoader = false;
        this.notifications = data;
      }
    );
  }

  longPollNewNotification() {
    this.checkForNewNotification(true);
    const subscribe = interval(15000).subscribe(
      () => { 
        this.checkForNewNotification();
      });
  }

  checkForNewNotification(forceRefresh:boolean = false) {
    const sub = this.notificationService.checkForNewNotification(forceRefresh).subscribe(
      (response) => {
        this.notificationCount = response["true"]!=undefined?response["true"]:response["false"];
        sub.unsubscribe();
      }
    );
  }

  messageRead() {
    this.notificationCount = (+this.notificationCount - 1)+"";
  }

  parseInt(input: string): number {
    const result:number = +input;
    return result;
  }

}
