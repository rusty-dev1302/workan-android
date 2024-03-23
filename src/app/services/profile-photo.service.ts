import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { constants } from 'src/environments/constants';
import { BaseResponse } from '../common/base-response';
import { ProfilePhoto } from '../common/profile-photo';

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {

  private baseUrl = constants.API_SERVER+'/api/v1/files/profilePhoto';

  private loadPhotoEditor$ = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
  ) { }

  loadPhotoEditor(): Observable<boolean>{
    return this.loadPhotoEditor$.asObservable();
  }

  emitLoadPhotoEditor(value: boolean) {
    this.loadPhotoEditor$.next(value);
  }

  uploadImage(uploadImageData: any): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<BaseResponse>(postUrl, uploadImageData);
  }

  getImageByCustomerId(customerId: number): Observable<ProfilePhoto> {
    const getUrl = `${this.baseUrl}/get?customerId=${customerId}`;
    return this.httpClient.get<ProfilePhoto>(getUrl);
  }

  removeImage(): Observable<BaseResponse> {
    const getUrl = `${this.baseUrl}/remove`;
    return this.httpClient.get<BaseResponse>(getUrl);
  }
}
