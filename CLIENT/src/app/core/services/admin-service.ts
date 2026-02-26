import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ManagedUser } from '../../../types/User';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private url = environment.apiUrl;
  private http = inject(HttpClient);

  getUserRoles(includeArchived: boolean = true){
    return this.http.get<ManagedUser[]>(this.url + 'admin/userroles?includeArchived=' + includeArchived);
  }

  editUserRoles(userId: string, roles: string[]){
    return this.http.post<string[]>(this.url + 'admin/edituserrole/' + userId + '?roles=' + roles,{})
  }

  archiveUser(userId: string){
    return this.http.post(this.url + 'admin/archiveuser/' + userId, {});
  }

  unarchiveUser(userId: string){
    return this.http.post(this.url + 'admin/unarchiveuser/' + userId, {});
  }
}
