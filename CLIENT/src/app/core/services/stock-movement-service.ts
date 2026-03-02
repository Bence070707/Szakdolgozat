import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';
import { StockMovement } from '../../../types/StockMovement';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  waitingForApproval = signal(0);

  getStockMovements(pageNumber = 1, pageSize = 5, search = '', pendingOnly = false) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    params = params.append('pendingOnly', pendingOnly);
    return this.http.get<PaginatedResult<StockMovement>>(this.url + 'stockmovements', { params })
  }

  initApprovalCount(){
    this.http.get<{count: number}>(this.url + 'stockmovements/getpendingapprovalcount').subscribe({
      next: response => this.waitingForApproval.set(response.count)
    });
  }

  approve(movementId: string) {
    return this.http.post(this.url + 'stockmovements?movementId=' + movementId, {});
  }

  disApprove(movementId: string) {
    return this.http.post(this.url + 'stockmovements/disapprove?movementId=' + movementId, {});
  }
}
