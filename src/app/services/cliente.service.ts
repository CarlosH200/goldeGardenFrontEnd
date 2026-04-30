import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { HttpClient } from '@angular/common/http';
import { ClienteModel } from '../models/clienteModel';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = `${urlApi.apiServer.urlBase}Clientes`;

  constructor(private http: HttpClient) {}

  // 🔥 NUEVO METODO (GET con búsqueda)
  buscarClientes(busqueda: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?busqueda=${busqueda}`);
  }

  // (ya tienes este)
  insertCliente(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body);
  }
}