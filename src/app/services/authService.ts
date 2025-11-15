// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Dejamos el Router por si lo necesitas después
import { LoginModel } from '../models/loginModel';
import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly endpoint = 'auth/login';
  private readonly baseUrl: string = this.ensureTrailingSlash(urlApi.apiServer.urlBase);
  // Asume que usas esta clave en localStorage o similar
  private readonly IS_LOGGED_IN_KEY = 'isLoggedInState'; 

  constructor(private http: HttpClient, private router: Router) {} 

  login(usuario: string, password: string): Observable<LoginModel> {
    const body = { usuario, password };
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.http.post<LoginModel>(url, body);
  }

  // ----------------------------------------------------
  // 💡 FUNCIÓN TEMPORAL DE CIERRE DE SESIÓN Y RECARGA
 logoutAndReload(): void {
    // 1. Limpia la variable de estado que te mantiene logueado
    localStorage.removeItem(this.IS_LOGGED_IN_KEY); 
    
    // 2. Fuerzando una recarga completa del navegador.
    // Esto reinicia toda la aplicación desde cero y fuerza la verificación de sesión.
    window.location.reload(); 
  }
  // ----------------------------------------------------

  // 🔧 Asegura que la base URL tenga una barra final
  private ensureTrailingSlash(url: string): string {
    return url.endsWith('/') ? url : url + '/';
  }
}