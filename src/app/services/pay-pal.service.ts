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

  makePayment(amount: number):Observable<any> {
    const postUrl = `${this.baseUrl}/make/payment?sum=${amount}`;
    console.log(postUrl)
    return this.httpClient.post<any>(postUrl, {});
  }

  completePayment(paymentId: string, payerId: string):Observable<any> {
    const postUrl = `${this.baseUrl}/complete/payment?paymentId=${paymentId}&PayerID=${payerId}`;
    console.log(postUrl)
    return this.httpClient.post<any>(postUrl, {});
  }

}
