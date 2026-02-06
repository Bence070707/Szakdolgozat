import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSaleDTO } from '../../../types/CreateSaleItemDTO';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  createSale(sale: CreateSaleDTO){
    return this.http.post(this.url + 'sales', sale);
  }
}
