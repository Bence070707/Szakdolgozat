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

  getKeys(pageNumber = 1, pageSize = 5, search = '', includeArchived = false) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    params = params.append('includeArchived', includeArchived);
    return this.http.get<PaginatedResult<Key>>(this.url + 'keys', { params });
  }

  getKeyById(id: string | null) {
    return this.http.get<Key>(this.url + 'keys/' + id);
  }

  updateKey(id: string, key: Key) {
    return this.http.put<Key>(this.url + 'keys/' + id, key)
  }

  getAllKeys() {
    return this.http.get<Key[]>(this.url + 'keys/' + 'getallkeys');

  }

  archiveKey(id: string){
    return this.http.post(this.url + 'keys/archive/' + id,{});
  }

  unArchiveKey(id: string){
    return this.http.post(this.url + 'keys/unarchive/' + id,{});
  }
}
