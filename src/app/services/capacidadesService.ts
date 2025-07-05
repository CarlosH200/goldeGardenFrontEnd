import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CapacidadesModel } from '../models/capacidadesModel';
import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class CapacidadesService {
  private apiUrl = `${urlApi.apiServer.urlBase}Capacidades`;

  constructor(private http: HttpClient) {}

  getCapacidades(): Observable<CapacidadesModel[]> {
    return this.http.get<CapacidadesModel[]>(this.apiUrl);
  }
}
