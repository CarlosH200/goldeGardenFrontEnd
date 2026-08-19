import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  private apiUrl = `${urlApi.apiServer.urlBase}Transacciones`;

  constructor(private http: HttpClient) { }

  // ==========================================================
  // INSERTAR TRANSACCION
  // ==========================================================
  insertTransaccion(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body);
  }

  // ==========================================================
  // BUSCAR TRANSACCIONES POR EVENTO
  // ==========================================================
  buscarTransaccionesEvento(idEvento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/evento/${idEvento}`);
  }

  // ==========================================================
  // ELIMINAR (soft delete) TRANSACCION
  // ==========================================================
  eliminarTransaccion(idTransaccion: number, usuario: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${idTransaccion}`,   // 👈 ya no repitas "Transacciones"
      {
        Estado: 2,              // estado que marca como eliminado
        M_Username: usuario     // usuario que realiza la acción
      }
    );
  }
}
