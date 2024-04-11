import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { PushNotification } from 'src/app/common/push-notification';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationSidebarComponent } from '../notification-sidebar/notification-sidebar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [NgIf, RouterLink, SidebarComponent, NotificationSidebarComponent]
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
    const sub = this.userService.getIsFirstLogin().subscribe(
      (isFirstLogin) => {
        this.isFirstLogin = isFirstLogin;
        if(this.isFirstLogin) {
          this.router.navigateByUrl(`/firstLogin`);
        } else {
          // already registered user 
          this.longPollNewNotification();
        }
        sub.unsubscribe();
      }
    );
    this.userService.updateFirstLogin();
  }

  getNotificationsForUser() {
    this.showLoader = true;
    this.checkForNewNotification(true);
    const sub = this.notificationService.getNotificationsForUser().subscribe(
      (data) => {
        this.showLoader = false;
        this.notifications = data;
        sub.unsubscribe();
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

  readAllMessages() {
    this.notificationService.readAllMessages().subscribe(
      (res)=>{
        if(res) {
          this.notificationCount = "0";
        }
      }
    );
  }

  parseInt(input: string): number {
    const result:number = +input;
    return result;
  }

}
