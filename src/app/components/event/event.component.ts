import { Component } from '@angular/core';
import { UbicacionesModel } from '../../models/ubicaciones.model';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { CommonModule } from '@angular/common';
import { TipoEventoService } from '../../services/tipoEventoService';
import { TipoEventoModel } from '../../models/tipoEvento.model';

@Component({
  selector: 'app-event',
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  // Arreglo para almacenar las ubicaciones de la API getUbicaciones
  ubicaciones: UbicacionesModel[] = [];
    // Arreglo para almacenar los tipos evento de la API getTipoEvento
  tipoEvento: TipoEventoModel[] = [];


  constructor(private ubicacionesService: UbicacionesService, private TipoEventoService: TipoEventoService) { }

  ngOnInit(): void {
    this.getUbicaciones();
    this.getTipoEvento();
  }

  // Funcion para consumir el servicio de ubicaciones disponibles
  getUbicaciones(): void {
    this.ubicacionesService.getUbicaciones().subscribe({
      next: (data) => this.ubicaciones = data,
      error: (err) => console.error('Error al cargar ubicaciones', err)
    });
  }

  // Funcion para consumir el servicio de Tipos Evento disponibles
  getTipoEvento(): void {
    this.TipoEventoService.getTipoEvento().subscribe({
      next: (data) => this.tipoEvento = data,
      error: (err) => console.error('Error al cargar ubicaciones', err)
    });
  }
}
