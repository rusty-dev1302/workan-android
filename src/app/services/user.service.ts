import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../common/customer';
import { Observable } from 'rxjs';
import { ContactDetail } from '../common/contact-detail';
import { constants } from 'src/environments/constants';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = constants.API_SERVER+'/api/v1/customer';

  constructor(private httpClient: HttpClient) { }

  getUserByEmail(email: string): Observable<Customer> {
    const getUrl = `${this.baseUrl}/detail?email=${email}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  getContactDetailByUserId(userId: number): Observable<ContactDetail> {
    const getUrl = `${this.baseUrl}/contact?customerId=${userId}`;
    return this.httpClient.get<ContactDetail>(getUrl);
  }

  saveUserData(user: Customer): Observable<Customer> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Customer>(postUrl, user);
  }

  saveUserContact(contactDetail: ContactDetail): Observable<ContactDetail> {
    const postUrl = `${this.baseUrl}/contact/save`;
    return this.httpClient.post<ContactDetail>(postUrl, contactDetail);
  }
  
}
