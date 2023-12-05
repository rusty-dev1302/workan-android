import { Component, Input } from '@angular/core';
import { PushNotification } from 'src/app/common/push-notification';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.css']
})
export class NotificationSidebarComponent {

  @Input() notifications: PushNotification[] = [];

}
