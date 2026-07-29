import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { urlApi } from '../providers/api.providers';

import { PagoModel } from '../models/pagoModel';
import { PagoResponse } from '../models/pagoResponseModel';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private apiUrl = `${urlApi.apiServer.urlBase}pagos`;

  constructor(private http: HttpClient) { }

  insertarPago(body:any):Observable<PagoResponse>{

      return this.http.post<PagoResponse>(
        this.apiUrl,
        body
      );

  }

  obtenerPagos(idEvento:number):Observable<{success:boolean,data:PagoModel[]}>{

      return this.http.get<{success:boolean,data:PagoModel[]}>(
        `${this.apiUrl}/${idEvento}`
      );

  }

}