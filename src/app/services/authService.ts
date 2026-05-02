import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginModel } from '../models/loginModel';
import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformId = inject(PLATFORM_ID);

  private readonly endpoint = 'auth/login';
  private readonly baseUrl: string = this.ensureTrailingSlash(urlApi.apiServer.urlBase);

  private readonly IS_LOGGED_IN_KEY = 'isLoggedInState';
  private readonly USERNAME_KEY = 'username'; // 🔥 NUEVO

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(usuario: string, password: string): Observable<LoginModel> {
    const body = { usuario, password };
    const url = `${this.baseUrl}${this.endpoint}`;

    return this.http.post<LoginModel>(url, body).pipe(
      tap((res) => {
        if (!this.isBrowser()) return;

        // 🔥 Guarda estado login
        localStorage.setItem(this.IS_LOGGED_IN_KEY, 'true');

        // 🔥 Guarda username
        localStorage.setItem(this.USERNAME_KEY, res?.usuario || usuario);
      })
    );
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem(this.IS_LOGGED_IN_KEY) === 'true';
  }

  // 🔥 NUEVO MÉTODO
  getUsername(): string {
    if (!this.isBrowser()) return 'anonimo';

    return localStorage.getItem(this.USERNAME_KEY) || 'anonimo';
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.IS_LOGGED_IN_KEY);
      localStorage.removeItem(this.USERNAME_KEY); // 🔥 IMPORTANTE
    }
  }

  private ensureTrailingSlash(url: string): string {
    return url.endsWith('/') ? url : url + '/';
  }
}