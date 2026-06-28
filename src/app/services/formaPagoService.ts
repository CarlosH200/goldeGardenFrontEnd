import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlApi } from '../providers/api.providers';
import { FormaPagoModel } from '../models/formaPagoModel';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  private apiUrl =
    `${urlApi.apiServer.urlBase}FormaPago`;

  constructor(
    private http: HttpClient
  ) { }

  getFormasPago(): Observable<FormaPagoModel[]> {

    return this.http.get<FormaPagoModel[]>(
      this.apiUrl
    );

  }
}