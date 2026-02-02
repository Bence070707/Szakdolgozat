import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Key } from '../../../types/Key';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class KeysService {
    private http = inject(HttpClient);
    private url = environment.apiUrl;

    getKeys(pageNumber = 1, pageSize = 5){
      let params = new HttpParams();

      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
      return this.http.get<PaginatedResult<Key>>(this.url + 'keys', { params });
    }

    getKeyById(id: string | null){
      return this.http.get<Key>(this.url + 'keys/' + id);
    }
}
