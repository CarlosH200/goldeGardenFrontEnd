import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { TipoEventoModel } from '../models/tipoEvento.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  private apiUrl = `${urlApi.apiServer.urlBase}TipoEvento`;

  constructor(private http: HttpClient) {}

  getTipoEvento(): Observable<TipoEventoModel[]> {
    return this.http.get<TipoEventoModel[]>(this.apiUrl);
  }
}
