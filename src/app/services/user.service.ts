import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../common/customer';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8081/api/v1/customer';

  constructor(private httpClient: HttpClient) { }

  getUserByEmail(email: string): Observable<Customer> {
    const getUrl = `${this.baseUrl}/detail?email=${email}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  saveUserData(user: Customer): Observable<Customer> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Customer>(postUrl, user);
    }
  
}
