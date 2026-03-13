import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../../types/Pagination';
import { Heel } from '../../../types/Heel';
import { CreateHeelDto } from '../../../types/CreateHeelDto';

@Injectable({
  providedIn: 'root',
})
export class HeelsService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  getHeels(pageNumber = 1, pageSize = 5, search = '', includeArchived = false) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    params = params.append('includeArchived', includeArchived);
    return this.http.get<PaginatedResult<Heel>>(this.url + 'heels', { params });
  }

  getHeelById(id: string | null) {
    return this.http.get<Heel>(this.url + 'heels/' + id);
  }

  updateHeel(id: string, heel: Heel, images: File[] = []) {
    const formData = new FormData();
    formData.append('id', heel.id);
    formData.append('price', heel.price.toString());
    formData.append('quantity', heel.quantity.toString());

    for (const image of images) {
      formData.append('images', image);
    }

    return this.http.put<Heel>(this.url + 'heels/' + id, formData)
  }

  getAllHeels(){
    return this.http.get<Heel[]>(this.url + 'heels/' + 'getallheels');
  }

  archiveHeel(id: string){
    return this.http.post(this.url + 'heels/archive/' + id,{});
  }

  unArchiveHeel(id: string){
    return this.http.post(this.url + 'heels/unarchive/' + id,{});
  }

  createHeel(heel: CreateHeelDto){
    return this.http.post<{heelId: string}>(this.url + 'heels/createheel', heel);
  }

  deleteImage(publicId: string){
    const params = new HttpParams().set('publicId', publicId);
    return this.http.delete(this.url + 'heels/deleteimage', { params });
  }

  setMainPhoto(publicId: string, heelId: string){
    let params = new HttpParams();
    params = params.append('publicId', publicId);
    params = params.append('heelId', heelId);
    return this.http.post(this.url + 'heels/set-main-photo', null, { params });
  }
}
