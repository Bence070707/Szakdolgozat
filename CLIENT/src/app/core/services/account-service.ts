import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginCreds, RegisterCreds, User } from '../../../types/User';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  currentUser = signal<User | null>(null);

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.url + 'account/register', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.url + 'account/login', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user)
  }
}
