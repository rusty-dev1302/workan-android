import { Injectable } from '@angular/core';
import { constants } from 'src/environments/constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateOrderRequest } from '../common/create-order-request';
import { BaseResponse } from '../common/base-response';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = constants.API_SERVER+'/api/v1/order';

  constructor(
    private httpClient: HttpClient,
  ) { }

  createOrder(createOrderRequest: CreateOrderRequest): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/create`;
    return this.httpClient.post<BaseResponse>(postUrl, createOrderRequest);
  }
}
