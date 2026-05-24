import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = `${urlApi.apiServer.urlBase}Productos`;

  constructor(private http: HttpClient) {}

  // ==========================================================
  // BUSCAR PRODUCTOS
  // ==========================================================
  buscarProductos(busqueda: string): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}?busqueda=${busqueda}`
    );
  }
}