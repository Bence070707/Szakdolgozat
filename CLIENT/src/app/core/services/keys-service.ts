import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Key } from '../../../types/Key';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';
import { CreateKeyDto } from '../../../types/CreateKeyDto';

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

  updateKey(id: string, key: Key, images: File[] = []) {
    const formData = new FormData();
    formData.append('id', key.id);
    formData.append('priceType', key.priceType.toString());
    formData.append('price', key.price.toString());
    formData.append('quantity', key.quantity.toString());

    for (const image of images) {
      formData.append('images', image);
    }

    return this.http.put<Key>(this.url + 'keys/' + id, formData)
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

  createKey(key: CreateKeyDto){
    return this.http.post<{keyId: string}>(this.url + 'keys/createkey', key);
  }

  deleteImage(publicId: string){
    const params = new HttpParams().set('publicId', publicId);
    return this.http.delete(this.url + 'keys/deleteimage', { params });
  }
}
