import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { HttpClient } from '@angular/common/http';
import { EstadosModel } from '../models/estadoModel';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private apiUrl = `${urlApi.apiServer.urlBase}Estados`;

  constructor(private http: HttpClient) {}

  getEstados(): Observable<EstadosModel[]> {
    return this.http.get<EstadosModel[]>(this.apiUrl);
  }
}