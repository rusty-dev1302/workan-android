import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';

@Injectable({
  providedIn: 'root'
})
export class PayPalService {

  private baseUrl = constants.API_SERVER + '/api/v1/paypal';

  constructor(
    private httpClient: HttpClient,
  ) { }

  makePayment(amount: number, orderId: number):Observable<any> {
    const postUrl = `${this.baseUrl}/make/payment?sum=${amount}&orderId=${orderId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

  updateOrder(paymentId: string, orderId: string):Observable<any> {
    const getUrl = `${this.baseUrl}/order/update?paymentId=${paymentId}&orderId=${orderId}`;
    return this.httpClient.get<any>(getUrl);
  }

  completePayment(paymentId: string, payerId: string, orderId: string):Observable<any> {
    const postUrl = `${this.baseUrl}/complete/payment?paymentId=${paymentId}&PayerID=${payerId}&orderId=${orderId}`;
    return this.httpClient.post<any>(postUrl, {});
  }

}
