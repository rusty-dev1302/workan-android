import { Injectable } from '@angular/core';
import { constants } from 'src/environments/constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateOrderRequest } from '../common/create-order-request';
import { BaseResponse } from '../common/base-response';
import { Order } from '../common/order';
import { CustomerOrder } from '../common/customer-order';
import { ProcessOrderRequest } from '../common/process-order-request';
import { Review } from '../common/review';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = constants.API_SERVER + '/api/v1/order';

  constructor(
    private httpClient: HttpClient,
  ) { }

  createOrder(createOrderRequest: CreateOrderRequest): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/create`;
    return this.httpClient.post<BaseResponse>(postUrl, createOrderRequest);
  }

  getOrdersForCustomer(customerId: number): Observable<Order[]> {
    const getUrl = `${this.baseUrl}/customer/all?customerId=${customerId}`;
    return this.httpClient.get<Order[]>(getUrl)
  }

  getOrdersForProfessional(professionalId: number): Observable<Order[]> {
    const getUrl = `${this.baseUrl}/professional/all?professionalId=${professionalId}`;
    return this.httpClient.get<Order[]>(getUrl)
  }

  getOrderDetailForCustomer(orderId: number): Observable<CustomerOrder> {
    const getUrl = `${this.baseUrl}/customer?orderId=${orderId}`;
    return this.httpClient.get<CustomerOrder>(getUrl)
  }

  getOrderDetailForProfessional(orderId: number): Observable<Order> {
    const getUrl = `${this.baseUrl}/professional?orderId=${orderId}`;
    return this.httpClient.get<Order>(getUrl)
  }

  processOrder(processOrderRequest: ProcessOrderRequest): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/process`;
    return this.httpClient.post<BaseResponse>(postUrl, processOrderRequest);
  }

  writeReview(review: Review): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/review`;
    return this.httpClient.post<BaseResponse>(postUrl, review);
  }

  getReviewsForProfessional(professionalId: number): Observable<Review[]> {
    const getUrl = `${this.baseUrl}/review/all?professionalId=${professionalId}`;
    return this.httpClient.get<Review[]>(getUrl)
  }

  getPaymentOtp(orderId: number): Observable<Review[]> {
    const getUrl = `${this.baseUrl}/review/all?professionalId=${orderId}`;
    return this.httpClient.get<Review[]>(getUrl)
  }

  confirmDirectPayment(orderId: number, otp: string): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/process`;
    return this.httpClient.post<BaseResponse>(postUrl, orderId);
  }

}
