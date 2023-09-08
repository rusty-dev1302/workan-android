import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Listing } from '../common/listing';
import { constants } from 'src/environments/constants';
import { SlotTemplate } from '../common/slot-template';
import { SlotTemplateItem } from '../common/slot-template-item';
import { BaseResponse } from '../common/base-response';
import { Customer } from '../common/customer';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  
  private baseUrl = constants.API_SERVER+'/api/v1/listing';

  constructor(private httpClient: HttpClient) { }

  getListingByEmail(email: string): Observable<Listing> {
    const getUrl = `${this.baseUrl}/detail?email=${email}`;
    return this.httpClient.get<Listing>(getUrl);
  }

  getListingsByFilters(subcategory: string, location: string): Observable<Listing[]> {
    const getUrl = `${this.baseUrl}/search?subcategory=${subcategory}&&location=${location}`;
    return this.httpClient.get<Listing[]>(getUrl)
  }

  getListingLocations(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/location`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getListingById(productId: number): Observable<Listing> {
    const getUrl = `${this.baseUrl}?id=${productId}`;
    return this.httpClient.get<Listing>(getUrl);
  }

  getListingSubcategories(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/subcategory`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getProfessionalById(professionalId: number): Observable<Customer> {
    const getUrl = `${this.baseUrl}/professional?id=${professionalId}`;
    return this.httpClient.get<Customer>(getUrl);
  }

  saveListing(product: Listing): Observable<Listing> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Listing>(postUrl, product);
  }


  getAllLocations(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/location/all`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getAllSubcategories(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/subcategory/all`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getSlotTemplates(listingId: number): Observable<SlotTemplate[]> {
    const getUrl = `${this.baseUrl}/slotTemplates?listingId=${listingId}`;
    return this.httpClient.get<SlotTemplate[]>(getUrl)
  }

  getAvailableSlotsItems(listingId: number, dayOfWeek: string): Observable<SlotTemplateItem[]> {
    const getUrl = `${this.baseUrl}/availableSlotsItems?listingId=${listingId}&&dayOfWeek=${dayOfWeek}`;
    return this.httpClient.get<SlotTemplateItem[]>(getUrl)
  }

  saveSlotTemplateItem(slotTemplateId: number, slotTemplateItem: SlotTemplateItem): Observable<SlotTemplateItem> {
    const postUrl = `${this.baseUrl}/slotTemplateItem/save?slotTemplateId=${slotTemplateId}`;
    return this.httpClient.post<SlotTemplateItem>(postUrl, slotTemplateItem);
  }

  removeSlotTemplateItem(slotTemplateItemId: number): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/slotTemplateItem/remove?slotTemplateItemId=${slotTemplateItemId}`;
    return this.httpClient.delete<BaseResponse>(postUrl);
  }

  toggleSlotTemplate(slotTemplateId: number): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/slotTemplate/toggle?slotTemplateId=${slotTemplateId}`;
    return this.httpClient.get<BaseResponse>(postUrl);
  }
}
