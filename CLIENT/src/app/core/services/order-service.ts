import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Order } from '../../../types/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  draftsLoading = signal<boolean>(false);
  drafts = signal<Order[] | null>(null);

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
}
