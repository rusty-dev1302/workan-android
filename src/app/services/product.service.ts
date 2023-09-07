import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { constants } from 'src/environments/constants';
import { SlotTemplate } from '../common/slot-template';
import { SlotTemplateItem } from '../common/slot-template-item';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = constants.API_SERVER+'/api/v1/listing';

  constructor(private httpClient: HttpClient) { }

  getProductByEmail(email: string): Observable<Product> {
    const getUrl = `${this.baseUrl}/detail?email=${email}`;
    return this.httpClient.get<Product>(getUrl);
  }

  getProductList(subcategory: string, location: string): Observable<Product[]> {
    const getUrl = `${this.baseUrl}/search?subcategory=${subcategory}&&location=${location}`;
    return this.httpClient.get<Product[]>(getUrl)
  }

  getListingLocations(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/location`;
    return this.httpClient.get<string[]>(getUrl)
  }

  getListingSubcategories(): Observable<string[]> {
    const getUrl = `${this.baseUrl}/subcategory`;
    return this.httpClient.get<string[]>(getUrl)
  }

  saveProduct(product: Product): Observable<Product> {
    const postUrl = `${this.baseUrl}/save`;
    return this.httpClient.post<Product>(postUrl, product);
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

  saveSlotTemplateItem(slotTemplateId: number, slotTemplateItem: SlotTemplateItem): Observable<SlotTemplateItem> {
    const postUrl = `${this.baseUrl}/slotTemplateItem/save?slotTemplateId=${slotTemplateId}`;
    return this.httpClient.post<SlotTemplateItem>(postUrl, slotTemplateItem);
  }
}
