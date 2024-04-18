import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';
import { BaseResponse } from '../common/base-response';
import { CreateOrderRequest } from '../common/create-order-request';
import { CustomerOrder } from '../common/customer-order';
import { Order } from '../common/order';
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

  scheduleOrderAppointment(orderId: number, slotTemplateItemId: number, request: CreateOrderRequest): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/confirm?orderId=${orderId}&&slotTemplateItemId=${slotTemplateItemId}&&scheduleOrder=true`;
    return this.httpClient.post<BaseResponse>(postUrl, request);
  }

  acceptOrder(orderId: number): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/confirm?orderId=${orderId}&&scheduleOrder=false`;
    return this.httpClient.post<BaseResponse>(postUrl, {});
  }

  getOrdersForCustomer(customerId: number): Observable<Order[]> {
    const getUrl = `${this.baseUrl}/customer/all?customerId=${customerId}`;
    return this.httpClient.get<Order[]>(getUrl)
  }

  getMenuItemsForOrder(orderId: number): Observable<any[]> {
    const getUrl = `${this.baseUrl}/menuItems?orderId=${orderId}`;
    return this.httpClient.get<any[]>(getUrl)
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

  initiateDirectPayment(orderId: number): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/direct/initiate?orderId=${orderId}`;
    return this.httpClient.get<BaseResponse>(getUrl)
  }

}
