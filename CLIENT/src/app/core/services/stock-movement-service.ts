import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';
import { StockMovement } from '../../../types/StockMovement';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  getStockMovements(pageNumber = 1, pageSize = 5, search = '') {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    return this.http.get<PaginatedResult<StockMovement>>(this.url + 'stockmovements', { params });
  }

  approve(movementId: string){
    return this.http.post(this.url + 'stockmovements?movementId=' + movementId, {});
  }

  disApprove(movementId: string){
    return this.http.post(this.url + 'stockmovements/disapprove?movementId=' + movementId, {});
  }
}
