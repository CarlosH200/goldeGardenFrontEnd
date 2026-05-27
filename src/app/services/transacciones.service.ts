import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private apiUrl =
    `${urlApi.apiServer.urlBase}Transacciones`;

  constructor(
    private http: HttpClient
  ) { }

  // ==========================================================
  // INSERTAR TRANSACCION
  // ==========================================================
  insertTransaccion(body: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      body
    );
  }
}