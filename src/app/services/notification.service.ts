import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';
import { PushNotification } from '../common/push-notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = constants.NOTIFICATION_SERVER + '/notification_service/api/v1/notification';

  constructor(
    private httpClient: HttpClient,
  ) { }

  checkForNewNotification(forceRefresh:boolean = false): Observable<any> {
    const getUrl = `${this.baseUrl}/check?forceRefresh=${forceRefresh}`;
    return this.httpClient.get<any>(getUrl)
  }

  markRead(notificationId: number): Observable<boolean> {
    const getUrl = `${this.baseUrl}/markRead?notificationId=${notificationId}`;
    return this.httpClient.get<boolean>(getUrl)
  }

  getNotificationsForUser(): Observable<PushNotification[]> {
    const getUrl = `${this.baseUrl}/all`;
    return this.httpClient.get<PushNotification[]>(getUrl)
  }

  
}
