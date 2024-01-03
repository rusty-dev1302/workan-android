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

  confirmDirectPayment(orderId: number, otp: string): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/direct/complete/payment?orderId=${orderId}&&paymentOtp=${otp}`;
    return this.httpClient.post<BaseResponse>(getUrl, {});
  }

}
