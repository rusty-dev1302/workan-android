import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Listing } from '../common/listing';
import { constants } from 'src/environments/constants';
import { SlotTemplate } from '../common/slot-template';
import { SlotTemplateItem } from '../common/slot-template-item';
import { BaseResponse } from '../common/base-response';
import { Customer } from '../common/customer';
import { Professional } from '../common/professional';

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

  getListingsByFilters(subcategory: string, geoHash: string, pageNumber: number): Observable<Listing[]> {
    const getUrl = `${this.baseUrl}/search?subcategory=${subcategory}&&geoHash=${geoHash}&&pageNumber=${pageNumber}`;
    return this.httpClient.get<Listing[]>(getUrl)
  }

  getListingById(listingId: number): Observable<Listing> {
    const getUrl = `${this.baseUrl}?id=${listingId}`;
    return this.httpClient.get<Listing>(getUrl);
  }

  getListingSubcategories(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/subcategory`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getProfessionalById(professionalId: number): Observable<Professional> {
    const getUrl = `${this.baseUrl}/professional?id=${professionalId}`;
    return this.httpClient.get<Professional>(getUrl);
  }

  saveListing(listing: Listing): Observable<Listing> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Listing>(postUrl, listing);
  }

  getAllSubcategories(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/subcategory/all`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getSlotTemplates(listingId: number): Observable<SlotTemplate[]> {
    const getUrl = `${this.baseUrl}/slotTemplates?listingId=${listingId}`;
    return this.httpClient.get<SlotTemplate[]>(getUrl)
  }

  getAvailableSlotsItems(listingId: number, dayOfWeek: string, date: string): Observable<SlotTemplateItem[]> {
    const getUrl = `${this.baseUrl}/availableSlotsItems?listingId=${listingId}&&dayOfWeek=${dayOfWeek}&&date=${date}`;
    return this.httpClient.get<SlotTemplateItem[]>(getUrl)
  }

  saveSlotTemplateItem(slotTemplateItem: SlotTemplateItem): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/slotTemplateItem/save`;
    return this.httpClient.post<BaseResponse>(postUrl, slotTemplateItem);
  }

  saveSlotTemplateItems(slotTemplateId: number, slotTemplateItems: SlotTemplateItem[]): Observable<BaseResponse> {
    const postUrl = `${this.baseUrl}/slotTemplateItems/save?slotTemplateId=${slotTemplateId}`;
    return this.httpClient.post<BaseResponse>(postUrl, slotTemplateItems);
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
