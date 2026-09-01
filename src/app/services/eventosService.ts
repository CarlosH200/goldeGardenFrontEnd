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

  actualizarEvento(id: number, body: any): Observable<EventoResponse> {
    return this.http.patch<EventoResponse>(`${this.apiUrl}/${id}`, body);
  }

  obtenerEvento(id: number): Observable<{ success: boolean, data: EventosModel }> {
    return this.http.get<{ success: boolean, data: EventosModel }>(`${this.apiUrl}/${id}`);
  }

  obtenerEventos(): Observable<{ success: boolean, data: EventosModel[] }> {
    return this.http.get<{ success: boolean, data: EventosModel[] }>(this.apiUrl);
  }

  // Método específico para bloquear/desbloquear evento
  bloquearEvento(id: number, bloqueado: boolean): Observable<EventoResponse> {
    return this.http.patch<EventoResponse>(`${this.apiUrl}/${id}/bloquear`, { bloqueado });
  }

  // Método para actualizar solo campos de impresión
  actualizarImpresion(id: number, impreso: boolean, impresiones: number): Observable<EventoResponse> {
    return this.http.patch<EventoResponse>(`${this.apiUrl}/${id}`, { impreso, impresiones });
  }

  // Método para actualizar solo el estado bloqueado
  actualizarBloqueado(id: number, bloqueado: boolean): Observable<EventoResponse> {
    return this.http.patch<EventoResponse>(`${this.apiUrl}/${id}`, { bloqueado });
  }
}