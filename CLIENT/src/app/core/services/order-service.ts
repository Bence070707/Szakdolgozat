import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Order } from '../../../types/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  getDrafts(){
    return this.http.get<Order[]>(this.url + 'orders/' + 'getdrafts');
  }

  getOrder(id: string){
    return this.http.get<Order>(this.url + 'orders/' + id);
  }
}
