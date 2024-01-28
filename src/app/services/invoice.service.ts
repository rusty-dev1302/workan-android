import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from 'src/environments/constants';
import { Invoice } from '../common/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl = constants.API_SERVER+'/api/v1/invoice';

  constructor(private httpClient: HttpClient) { }

  createInvoice(orderId: number, mode: string): Observable<Invoice> {
    const postUrl = `${this.baseUrl}/create?orderId=${orderId}&&mode=${mode}`;
    return this.httpClient.post<Invoice>(postUrl, {});
  }
}
