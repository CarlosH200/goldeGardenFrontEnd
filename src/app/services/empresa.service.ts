import { Injectable } from '@angular/core';
import { EmpresaModel } from '../models/empresaModel';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  // Base de datos estática temporal de empresas
  private empresas: EmpresaModel[] = [
    {
      id: 1,
      nombre: 'Golden Garden',
      direccion: '4ta. Avenida y 4ta. Calle, Barrio Asunción, Tecpán Guatemala, Chimaltenango',
      telefono: '32861562',
      redes: 'Facebook: golden gardeen jardin de eventos',
      logoUrl: 'assets/goldengarden.png',
      colorPrincipal: '#1f3a1f',   // Verde bosque profundo
      colorSecundario: '#2f4f4f',  // Verde oscuro
      colorTextoOscuro: '#333333', 
      colorTextoClaro: '#5d5d5d'
    },
    {
      id: 2,
      nombre: 'Hora de Fiesta',
      direccion: 'Tecpán Guatemala, Chimaltenango',
      telefono: '32861562',
      redes: 'Facebook: Hora de Fiesta',
      logoUrl: 'assets/HoraDeFiesta.png',
      colorPrincipal: '#9c27b0',   // Rosa festivo
      colorSecundario: '#52f3ff',  // Morado
      colorTextoOscuro: '#333333', 
      colorTextoClaro: '#666666'
    },
    {
      id: 3,
      nombre: 'Golden Prime Audio',
      direccion: 'Tecpán Guatemala, Chimaltenango',
      telefono: '+502 5060 2980',
      redes: 'Facebook: Golden Prime Audio',
      logoUrl: 'assets/GoldenPrimeAudio.jpg',
      colorPrincipal: '#000000',   // Negro
      colorSecundario: '#fbc02d',  // Dorado Neón
      colorTextoOscuro: '#111111', 
      colorTextoClaro: '#555555'
    },
    {
      id: 4,
      nombre: 'Mobiliario Alex',
      direccion: 'Tecpán Guatemala, Chimaltenango',
      telefono: '32861562',
      redes: 'Facebook: Mobiliario Alex',
      logoUrl: 'assets/mobiliarioalex.png',
      colorPrincipal: '#1976d2',   // Azul
      colorSecundario: '#00796b',  // Verde azulado
      colorTextoOscuro: '#212121', 
      colorTextoClaro: '#757575'
    }
  ];

  constructor() { }

  obtenerEmpresas(): EmpresaModel[] {
    return this.empresas;
  }

  obtenerEmpresaPorId(id: number): EmpresaModel | undefined {
    return this.empresas.find(e => e.id === id);
  }
}
