import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlApi } from '../providers/api.providers';
import { HttpClient } from '@angular/common/http';
import { OrganizadorModel } from '../models/organizadorModel';

@Injectable({
  providedIn: 'root'
})
export class OrganizadorService {
  private apiUrl = `${urlApi.apiServer.urlBase}Organizador`;

  constructor(private http: HttpClient) {}

  getOrganizador(): Observable<OrganizadorModel[]> {
    return this.http.get<OrganizadorModel[]>(this.apiUrl);
  }
}
