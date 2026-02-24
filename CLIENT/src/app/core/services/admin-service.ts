import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../types/User';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private url = environment.apiUrl;
  private http = inject(HttpClient);

  getUserRoles(){
    return this.http.get<User[]>(this.url + 'admin/userroles');
  }

  editUserRoles(userId: string, roles: string[]){
    return this.http.post<string[]>(this.url + 'admin/edituserrole/' + userId + '?roles=' + roles,{})
  }
}
