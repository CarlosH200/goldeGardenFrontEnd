import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { ClienteCreateRequest } from '../models/clienteCreateRequest';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private readonly endpoint = 'clientes';
  private readonly baseUrl: string = this.ensureTrailingSlash(urlApi.apiServer.urlBase);

  constructor(private http: HttpClient) {}

  insertCliente(model: ClienteCreateRequest): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.http.post<any>(url, model);
  }

  private ensureTrailingSlash(url: string): string {
    return url.endsWith('/') ? url : url + '/';
  }
}
