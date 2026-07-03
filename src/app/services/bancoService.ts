import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlApi } from '../providers/api.providers';
import { BancoModel } from '../models/bancoModel';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private apiUrl =
    `${urlApi.apiServer.urlBase}Banco`;

  constructor(
    private http: HttpClient
  ) { }

  getBancos():
    Observable<BancoModel[]> {

    return this.http.get<BancoModel[]>(
      this.apiUrl
    );

  }

}