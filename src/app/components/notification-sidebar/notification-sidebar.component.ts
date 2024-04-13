import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PushNotification } from 'src/app/common/push-notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-notification-sidebar',
    templateUrl: './notification-sidebar.component.html',
    styleUrls: ['./notification-sidebar.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, NgClass, RouterLink, DatePipe]
})
export class NotificationSidebarComponent {

  @Input() notifications: PushNotification[] = [];
  @Input() unreadCount: number = 0;
  @Output() readMessageEvent = new EventEmitter<boolean>();
  @Output() readAllEvent = new EventEmitter<boolean>();

  @Input() showLoader: boolean = false;

  constructor(private notificationService: NotificationService) {

  }

  markAllRead() {
    this.notifications.forEach(
      (notification)=>{
        notification.messageRead = true;
      }
    );
    this.readAllEvent.emit(true);
  }

  markRead(notification: PushNotification) {
    if(!notification.messageRead) {
      notification.messageRead = true;
      this.readMessageEvent.emit(true);
      const sub = this.notificationService.markRead(notification.id).subscribe(
        () => {
          sub.unsubscribe();
        }
      );
    }
  }

}
