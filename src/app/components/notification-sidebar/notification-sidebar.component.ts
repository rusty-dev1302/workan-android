import { Component, Input } from '@angular/core';
import { PushNotification } from 'src/app/common/push-notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.css']
})
export class NotificationSidebarComponent {

  @Input() notifications: PushNotification[] = [];

  constructor(private notificationService: NotificationService) {

  }

  markRead(notification: PushNotification) {
    if(!notification.messageRead) {
      notification.messageRead = true;
      const sub = this.notificationService.markRead(notification.id).subscribe(
        () => {
          sub.unsubscribe();
        }
      );
    }
  }

}
