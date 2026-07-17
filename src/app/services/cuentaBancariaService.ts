import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlApi } from '../providers/api.providers';
import { CuentaBancariaModel } from '../models/cuentaBancariaModel';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService {

  private apiUrl =
    `${urlApi.apiServer.urlBase}CuentaBancaria`;

  constructor(
    private http: HttpClient
  ) { }

 getCuentasBancarias(
  idBanco: number
): Observable<CuentaBancariaModel[]> {

  return this.http.get<CuentaBancariaModel[]>(
    `${this.apiUrl}/${idBanco}`
  );

}

}