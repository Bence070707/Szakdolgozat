import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';
import { Heel } from '../../../types/Heel';

@Injectable({
  providedIn: 'root',
})
export class HeelsService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  getHeels(pageNumber = 1, pageSize = 5, search = '') {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    return this.http.get<PaginatedResult<Heel>>(this.url + 'heels', { params });
  }

  getHeelById(id: string | null) {
    return this.http.get<Heel>(this.url + 'heels/' + id);
  }

  updateHeel(id: string, key: Heel) {
    return this.http.put<Heel>(this.url + 'heels/' + id, key)
  }

  getAllHeels(){
    return this.http.get<Heel[]>(this.url + 'heels/' + 'getallheels');
  }
}
