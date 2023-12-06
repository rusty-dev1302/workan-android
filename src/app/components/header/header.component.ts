import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService} from 'keycloak-angular';
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
        }
      }
    );
    this.userService.updateFirstLogin();
  }

  getNotificationsForUser() {
    this.notificationService.getNotificationsForUser().subscribe(
      (data) => {
        this.notifications = data;
      }
    );
  }

}
