import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from 'src/environments/constants';
import { BaseResponse } from '../common/base-response';
import { ContactDetail } from '../common/contact-detail';
import { Customer } from '../common/customer';
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

  activateInactivateListing(listingId: number): Observable<any> {
    const getUrl = `${this.baseUrl}/listing/toggle?listingId=${listingId}`;
    return this.httpClient.get<any>(getUrl);
  }

  verifyCertificationById(certificationId: number): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/certification/verify?certificationId=${certificationId}`;
    return this.httpClient.get<any>(getUrl);
  }

  rejectCertificationById(certificationId: number): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/certification/reject?certificationId=${certificationId}`;
    return this.httpClient.get<any>(getUrl);
  }

  acceptRejectPortImage(portPhotoId: number, status: boolean): Observable<BaseResponse> {
    let getUrl = "";
    if(status) {
      getUrl = `${this.baseUrl}/portfolio/enable?portPhotoId=${portPhotoId}`;
    } else {
      getUrl = `${this.baseUrl}/portfolio/disable?portPhotoId=${portPhotoId}`;
    }
    return this.httpClient.get<any>(getUrl);
  }

  toggleDeletableById(certificationId: number): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/certification/deleteAllowed?certificationId=${certificationId}`;
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

  getListingForUser(email: string): Observable<Listing> {
    const getUrl = `${this.baseUrl}/listing?email=${email}`;
    return this.httpClient.get<Listing>(getUrl);
  }


  constructor(
    private httpClient: HttpClient,
  ) { }
}
