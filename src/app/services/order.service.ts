import { Injectable } from '@angular/core';
import { constants } from 'src/environments/constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = constants.API_SERVER+'/api/v1/order';

  constructor() { }
}
