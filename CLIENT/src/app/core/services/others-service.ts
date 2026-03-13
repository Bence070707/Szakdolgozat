import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';
import { Other } from '../../../types/Other';
import { CreateOtherDto } from '../../../types/CreateOtherDto';

@Injectable({
  providedIn: 'root',
})
export class OthersService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  getOthers(pageNumber = 1, pageSize = 5, search = '', includeArchived = false) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    params = params.append('includeArchived', includeArchived);
    return this.http.get<PaginatedResult<Other>>(this.url + 'others', { params });
  }

  getOtherById(id: string | null) {
    return this.http.get<Other>(this.url + 'others/' + id);
  }

  updateOther(id: string, other: Other, images: File[] = []) {
    const formData = new FormData();
    formData.append('id', other.id);
    formData.append('name', other.name);
    formData.append('price', other.price.toString());
    formData.append('quantity', other.quantity.toString());

    for (const image of images) {
      formData.append('images', image);
    }

    return this.http.put<Other>(this.url + 'others/' + id, formData)
  }

  getAllOthers() {
    return this.http.get<Other[]>(this.url + 'others/' + 'getallothers');
  }

  archiveOther(id: string) {
    return this.http.post(this.url + 'others/archive/' + id, {});
  }

  unArchiveOther(id: string) {
    return this.http.post(this.url + 'others/unarchive/' + id, {});
  }

  createOther(other: CreateOtherDto) {
    return this.http.post<{ otherId: string }>(this.url + 'others/createother', other);
  }

  deleteImage(publicId: string){
    const params = new HttpParams().set('publicId', publicId);
    return this.http.delete(this.url + 'others/deleteimage', { params });
  }

  setMainPhoto(publicId: string, otherId: string){
    let params = new HttpParams();
    params = params.append('publicId', publicId);
    params = params.append('otherId', otherId);
    return this.http.post(this.url + 'others/set-main-photo', null, { params });
  }
}
