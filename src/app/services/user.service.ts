import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../common/customer';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { ContactDetail } from '../common/contact-detail';
import { constants } from 'src/environments/constants';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { PaymentAccount } from '../common/payment-account';
import { Certification } from '../common/certification';
import { BaseResponse } from '../common/base-response';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = constants.API_SERVER+'/api/v1/customer';
  private isFirstLogin$ = new Subject<boolean>();
  private currentUser$ = new BehaviorSubject<Customer>(constants.DEFAULT_CUSTOMER);

  constructor(
    private httpClient: HttpClient,
    private keycloakService: KeycloakService,
    ) {}

  getUserByEmail(email: string) {
    const getUrl = `${this.baseUrl}/detail?email=${email}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  getCertificationsByEmail(email: string): Observable<Certification[]> {
    const getUrl = `${this.baseUrl}/certification/all?email=${email}`;
    return this.httpClient.get<Certification[]>(getUrl);
  }

  getPaymentAccountByEmail(email: string) {
    const getUrl = `${this.baseUrl}/paymentAccount/detail?email=${email}`;
    return this.httpClient.get<PaymentAccount>(getUrl);
  }

  getContactDetailByUserId(userId: number): Observable<ContactDetail> {
    const getUrl = `${this.baseUrl}/contact?customerId=${userId}`;
    return this.httpClient.get<ContactDetail>(getUrl);
  }

  saveUserData(user: Customer): Observable<Customer> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Customer>(postUrl, user);
  }

  saveUserCertification(certification: Certification): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/certification/save`;
    return this.httpClient.post<BaseResponse>(postUrl, certification);
  }

  removeUserCertification(certId: number): Observable<BaseResponse> {
    const putUrl = `${this.baseUrl}/certification/remove?certId=${certId}`;
    return this.httpClient.delete<BaseResponse>(putUrl);
  }

  sendCertForVerification(certId: number): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/certification/verify?certId=${certId}`;
    return this.httpClient.get<BaseResponse>(getUrl);
  }

  removeAllCertAttachments(certId: number): Observable<BaseResponse> {
    const putUrl = `${this.baseUrl}/certification/attachments/removeAll?certId=${certId}`;
    return this.httpClient.delete<BaseResponse>(putUrl);
  }

  saveUserContact(contactDetail: ContactDetail): Observable<ContactDetail> {
    const postUrl = `${this.baseUrl}/contact/save`;
    return this.httpClient.post<ContactDetail>(postUrl, contactDetail);
  }

  getCurrentUserProfile(): Observable<KeycloakProfile> {
    const result = new Observable<KeycloakProfile>((subject) => {
      this.keycloakService.isLoggedIn().then(
        (isLoggedIn) => {
          if(isLoggedIn) {
            this.keycloakService.loadUserProfile().then(
              (userProfile) => {
                subject.next(userProfile);
              }
            );
          }
        }
      );
    });
    return result;
  }

  getCurrentUser(): Observable<Customer> {
    return this.currentUser$.asObservable();
  }

  getIsFirstLogin(): Observable<boolean> {
    return this.isFirstLogin$.asObservable();
  }
  
  updateFirstLogin() {
    this.getCurrentUserProfile().subscribe(
      (userProfile) => {
        if(userProfile) {

          this.getUserByEmail(userProfile.email!).subscribe(
            (user) => {

              if(user.state==constants.ERROR_STATE && user.message=='Customer does not exist') {
                // user does not exist 
                this.isFirstLogin$.next(true);
              } else {
                // user already exists
                this.isFirstLogin$.next(false);
                this.currentUser$.next(user);
              }
            }
          );
        }
      }
    );
   }
}
