import { Injectable } from '@angular/core';
import { constants } from 'src/environments/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PushNotification } from '../common/push-notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = constants.NOTIFICATION_SERVER + '/notification_service/api/v1/notification';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getNotificationsForUser(): Observable<PushNotification[]> {
    const getUrl = `${this.baseUrl}/all`;
    return this.httpClient.get<PushNotification[]>(getUrl)
  }
}
