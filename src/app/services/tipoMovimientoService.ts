import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlApi } from '../providers/api.providers';
import { TipoMovimientoModel } from '../models/tipoMovimientoModel';

@Injectable({
  providedIn: 'root'
})
export class TipoMovimientoService {

  private apiUrl =
    `${urlApi.apiServer.urlBase}TipoMovimiento`;

  constructor(
    private http: HttpClient
  ) { }

  getTiposMovimiento():
    Observable<TipoMovimientoModel[]> {

    return this.http.get<TipoMovimientoModel[]>(
      this.apiUrl
    );

  }

}