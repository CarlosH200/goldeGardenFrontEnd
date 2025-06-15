import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UbicacionesModel } from '../models/ubicaciones.model';
import { urlApi } from '../providers/api.providers';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private apiUrl = `${urlApi.apiServer.urlBase}Ubicaciones`;

  constructor(private http: HttpClient) {}

  getUbicaciones(): Observable<UbicacionesModel[]> {
    return this.http.get<UbicacionesModel[]>(this.apiUrl);
  }
}
