// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/loginModel';
import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly endpoint = 'auth/login';
  private readonly baseUrl: string = this.ensureTrailingSlash(urlApi.apiServer.urlBase);

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<LoginModel> {
    const body = { usuario, password };
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.http.post<LoginModel>(url, body);
  }

  // 🔧 Asegura que la base URL tenga una barra final
  private ensureTrailingSlash(url: string): string {
    return url.endsWith('/') ? url : url + '/';
  }
}
