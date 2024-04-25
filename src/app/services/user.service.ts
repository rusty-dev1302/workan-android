import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { constants } from 'src/environments/constants';
import { BaseResponse } from '../common/base-response';
import { Certification } from '../common/certification';
import { ContactDetail } from '../common/contact-detail';
import { Customer } from '../common/customer';
import { PaymentAccount } from '../common/payment-account';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = constants.API_SERVER+'/api/v1/customer';
  private rewardsBaseUrl = constants.API_SERVER+'/api/v1/rewards'

  private isFirstLogin$ = new Subject<boolean>();
  private currentUser$ = new BehaviorSubject<Customer>(constants.DEFAULT_CUSTOMER);

  constructor(
    private httpClient: HttpClient,
    private keycloakService: KeycloakService,
    ) {}

  getUserByEmail(email: string): Observable<Customer> {
    const getUrl = `${this.baseUrl}/detail?email=${email}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  getUserShortByEmail(email: string): Observable<Customer> {
    const getUrl = `${this.baseUrl}/detail/short?email=${email}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  getCertificationsByEmail(email: string): Observable<Certification[]> {
    const getUrl = `${this.baseUrl}/certification/all?email=${email}`;
    return this.httpClient.get<Certification[]>(getUrl);
  }

  getReferralCodeInfo(): Observable<any> {
    const getUrl = `${this.rewardsBaseUrl}/customer/referralCode`;
    return this.httpClient.get<any>(getUrl);
  }

  getCompletedOrdersInfo(month: number): Observable<number> {
    const getUrl = `${this.rewardsBaseUrl}/professional/completedOrders?month=${month}`;
    return this.httpClient.get<number>(getUrl);
  }

  linkUserToReferralCode(code: string): Observable<BaseResponse> {
    const postUrl = `${this.rewardsBaseUrl}/customer/referralCode/apply?code=${code}`;
    return this.httpClient.post<BaseResponse>(postUrl, {});
  }

  getPaymentAccountByEmail(email: string) {
    const getUrl = `${this.baseUrl}/paymentAccount/detail?email=${email}`;
    return this.httpClient.get<PaymentAccount>(getUrl);
  }

  getContactDetailByUserId(userId: number): Observable<ContactDetail> {
    const getUrl = `${this.baseUrl}/contact?customerId=${userId}`;
    return this.httpClient.get<ContactDetail>(getUrl);
  }

  getContactDetailByEmail(email: string): Observable<ContactDetail> {
    const getUrl = `${this.baseUrl}/contact/byEmail?email=${email}`;
    return this.httpClient.get<ContactDetail>(getUrl);
  }

  saveUserData(user: Customer): Observable<Customer> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Customer>(postUrl, user);
  }

  addPaypalAccount(email: string): Observable<Customer> {
    const postUrl = `${this.baseUrl}/paypalAccount/add?email=${email}`;
    return this.httpClient.post<Customer>(postUrl, {});
  }

  verifyPaypalOtp(otp: string): Observable<Customer> {
    const postUrl = `${this.baseUrl}/paypalAccount/verifyOtp?otp=${otp}`;
    return this.httpClient.post<Customer>(postUrl, {});
  }

  removePaypalAccount(): Observable<Customer> {
    const postUrl = `${this.baseUrl}/paypalAccount/remove`;
    return this.httpClient.post<Customer>(postUrl, {});
  }

  saveUserCertification(certification: Certification): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/certification/save`;
    return this.httpClient.post<BaseResponse>(postUrl, certification);
  }

  certificationVisibility(certificationId: number): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/certification/visibility?certificationId=${certificationId}`;
    return this.httpClient.post<BaseResponse>(postUrl, certificationId);
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
    const sub1 = this.getCurrentUserProfile().subscribe(
      (userProfile) => {
        if(userProfile) {

          const sub2 = this.getUserShortByEmail(userProfile.email!).subscribe(
            (user) => {

              if(user.state==constants.ERROR_STATE && user.message=='Customer does not exist') {
                // user does not exist 
                this.isFirstLogin$.next(true);
              } else {
                // user already exists
                this.isFirstLogin$.next(false);
                this.currentUser$.next(user);
              }
              sub2.unsubscribe();
            }
          );
        }
        sub1.unsubscribe();
      }
    );
   }
}
