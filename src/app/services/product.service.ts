import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { constants } from 'src/environments/constants';

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


  // searchProducts(subcategory: string): Observable<Product[]> {
  //   const searchUrl = `${this.baseUrl}/listing/search?name=${subcategory}`;
  //   return this.httpClient.get<GetProductsResponse>(searchUrl).pipe(
  //     map(response => response._embedded.products)
  //   )
  // }
}

interface GetProductsResponse {
  _embedded: {
    products: Product[];
  }
}

interface GetProductDetailsResponse {
  _embedded: {
    product: Product;
  }
}
