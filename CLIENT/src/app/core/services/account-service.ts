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
    return this.http.post<User>(this.url + 'account/register', creds, { withCredentials: true }).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.automatedRefreshTokenRequest();
        }
      })
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.url + 'account/login', creds, { withCredentials: true }).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.automatedRefreshTokenRequest();
        }
      })
    )
  }

  refreshToken() {
    return this.http.post<User>(this.url + 'account/refresh-token', {}, { withCredentials: true })
  }

  automatedRefreshTokenRequest() {
    setInterval(() => {
      this.http.post<User>(this.url + 'account/refresh-token', {}, { withCredentials: true }).subscribe({
        next: user => {
          this.setCurrentUser(user);
        },
        error: () => {
          this.logout();
        }
      })
    }, 1000 * 60 * 5);
  }

  logout() {
    this.http.post(this.url + 'account/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        this.currentUser.set(null);

      }
    })
  }

  setCurrentUser(user: User) {
    this.setRolesForStorage(user);
    this.currentUser.set(user)
  }

  private setRolesForStorage(user: User) {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const playloadJson = JSON.parse(decoded);
    const roles = playloadJson.role;
    user.roles = Array.isArray(roles) ? roles : [roles];
  }
}
