import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { HttpClient } from '@angular/common/http';
import { EventoResponse } from '../models/eventosResponseModel';
import { EventosModel } from '../models/eventosModel';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private apiUrl = `${urlApi.apiServer.urlBase}eventos`;

  constructor(private http: HttpClient) {}

  insertarEvento(body: any): Observable<EventoResponse> {
    return this.http.post<EventoResponse>(this.apiUrl, body);
  }

  obtenerEvento(id: number): Observable<{ success: boolean, data: EventosModel }> {
    return this.http.get<{ success: boolean, data: EventosModel }>(`${this.apiUrl}/${id}`);
  }
}