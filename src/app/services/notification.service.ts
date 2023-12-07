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

  checkForNewNotification(): Observable<any> {
    const getUrl = `${this.baseUrl}/check`;
    return this.httpClient.get<any>(getUrl)
  }

  getNotificationsForUser(): Observable<PushNotification[]> {
    const getUrl = `${this.baseUrl}/all`;
    return this.httpClient.get<PushNotification[]>(getUrl)
  }

  
}
