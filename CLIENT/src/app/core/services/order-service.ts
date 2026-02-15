import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Order } from '../../../types/Order';
import { PaginatedResult } from '../../../types/Pagination';
import { SummarisedOrderItem } from '../../../types/SummarisedOrderItem';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  draftsLoading = signal<boolean>(false);
  drafts = signal<Order[] | null>(null);

  getOrders(pageSize = 5, pageNumber = 1){
    let params = new HttpParams()

    params = params.append('pageSize', pageSize);
    params = params.append('pageNumber', pageNumber);
    return this.http.get<PaginatedResult<Order>>(this.url + 'orders', { params });
  }

  getSummarisedOrderItems(id: string){
    return this.http.get<SummarisedOrderItem[]>(this.url + 'orders/' + id + '/summarisedorderitem')
  }

  getDrafts(){
    return this.http.get<Order[]>(this.url + 'orders/' + 'getdrafts');
  }

  getOrder(id: string){
    return this.http.get<Order>(this.url + 'orders/' + id);
  }

  getNewDraft(){
    return this.http.post<Order>(this.url + 'orders/' + "draft",{})
  }

  deleteOrder(id: string){
    return this.http.delete(this.url + 'orders/' + id);
  }

  updateOrder(order: Order){
    return this.http.put(this.url + 'orders/' + order.id, order);
  }

    loadDrafts() {
    this.draftsLoading.set(true);

    this.http.get<Order[]>(this.url + 'orders/' + 'getdrafts')
      .subscribe({
        next: res => this.drafts.set(res),
        error: err => console.error(err),
        complete: () => this.draftsLoading.set(false)
      });
  }

  submitOrder(order: Order){
    return this.http.post(this.url + 'orders/' + order.id + '/submit', order);
  }

  receiveOrder(order: Order){
    return this.http.post(this.url + 'orders/' + order.id + '/receive', order);
  }
}
