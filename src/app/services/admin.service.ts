import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';
import { Customer } from '../common/customer';
import { ContactDetail } from '../common/contact-detail';
import { Listing } from '../common/listing';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = constants.API_SERVER + '/api/v1/admin';

  getAllCertificationsToVerify(): Observable<any> {
    const getUrl = `${this.baseUrl}/certification/verifyList`;
    return this.httpClient.get<any>(getUrl);
  }

  getUserByEmail(email: string) {
    const getUrl = `${this.baseUrl}/customer?email=${email}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  getContactDetailByUserId(userId: number) {
    const getUrl = `${this.baseUrl}/contact?customerId=${userId}`;
    return this.httpClient.get<ContactDetail>(getUrl);
  }

  getListingForUser(userId: number): Observable<Listing> {
    const getUrl = `${this.baseUrl}/listing?customerId=${userId}`;
    return this.httpClient.get<Listing>(getUrl);
  }


  constructor(
    private httpClient: HttpClient,
  ) { }
}
