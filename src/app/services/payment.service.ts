import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';
import { BaseResponse } from '../common/base-response';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = constants.PAYMENT_SERVER + '/payment_service/api/v1';

  constructor(
    private httpClient: HttpClient,
  ) { }

  makePayment(amount: number, orderId: number):Observable<any> {
    const postUrl = `${this.baseUrl}/paypal/make/payment?sum=${amount}&orderId=${orderId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  completePayment(paymentId: string, payerId: string, orderId: string):Observable<any> {
    const postUrl = `${this.baseUrl}/paypal/complete/payment?paymentId=${paymentId}&PayerID=${payerId}&orderId=${orderId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  addMoneyWalletStart(amount: string, paymentAccountId: string, isProfessional: boolean):Observable<any> {
    const postUrl = `${this.baseUrl}/wallet/make/payment?sum=${amount}&paymentAccountId=${paymentAccountId}&isProfessional=${isProfessional}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  addMoneyWalletComplete(paymentId: string, payerId: string, paymentAccountId: string):Observable<any> {
    const postUrl = `${this.baseUrl}/wallet/complete/payment?paymentId=${paymentId}&PayerID=${payerId}&paymentAccountId=${paymentAccountId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  redeemWalletStart(amount: string, paymentAccountId: string):Observable<any> {
    const postUrl = `${this.baseUrl}/wallet/redeem/initiate?sum=${amount}&paymentAccountId=${paymentAccountId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  redeemWalletConfirmOtp(otp: string, paymentAccountId: string):Observable<any> {
    const postUrl = `${this.baseUrl}/wallet/redeem/complete?otp=${otp}&paymentAccountId=${paymentAccountId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  confirmDirectPayment(orderId: number): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/direct/complete/payment?orderId=${orderId}`;
    return this.httpClient.post<BaseResponse>(getUrl, {});
  }

}
