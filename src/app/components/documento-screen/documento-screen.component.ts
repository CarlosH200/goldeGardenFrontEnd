import { Component } from '@angular/core';
import { UbicacionesModel } from '../../models/ubicaciones.model';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { CommonModule } from '@angular/common';
import { TipoEventoService } from '../../services/tipoEventoService';
import { TipoEventoModel } from '../../models/tipoEvento.model';
import { OrganizadorService } from '../../services/organizadorService';
import { OrganizadorModel } from '../../models/organizadorModel';
import { CapacidadesService } from '../../services/capacidadesService';
import { CapacidadesModel } from '../../models/capacidadesModel';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-documento-screen',
  imports: [FormsModule,CommonModule],
  templateUrl: './documento-screen.component.html',
  styleUrl: './documento-screen.component.css'
})
export class DocumentoScreenComponent {

  // Vaiable para almacenar el titulo del evento
  pTituloEvento: string = '';
  // Variable para almacenar la descripcion del evento
  pDescripcionEvento: string = '';
  // Variable para almacenar la fecha de entrega del evento
  pFechaEntregaEvento: string = '';
  // Variable para almacenar la fecha de recoger del evento
  pFechaRecogerEvento: string = '';
  // Variable para almacenar la fecha de inicio del evento
  pFechaInicioEvento: string = '';
  // Variable para almacenar la fecha de fin del evento
  pFechaFinEvento: string = '';
  // Variable para almecenar el id de la uibicacion seleccionada (valor 1 por defecto si no hay seleccion)
  pUbicacionEvento: number = 1 ;
  // Variabpara almacenar al organizador del evento (valor 1 por defecto si no hay seleccion)
  pOrganizadorEvento: number = 1;
  // Variable para almacenar el tipo de evento (valor 1 por defecto si no hay seleccion)
  pTipoEvento: number = 1;
  // Variable para almacenar la capacidad del evento (valor 1 por defecto si no hay seleccion)
  pCapacidadEvento: number = 1;
  // Variable para almacenar detalles extras del evento
  pDetallesEvento: string = '';
  // Arreglo para almacenar las ubicaciones de la API getUbicaciones
  ubicaciones: UbicacionesModel[] = [];
  // Arreglo para almacenar los tipos evento de la API getTipoEvento
  tipoEvento: TipoEventoModel[] = [];
  // Arreglo para almacenar los tipos Organizador de la API getOrganizadores
  Organizadores: OrganizadorModel[] = [];
  // Arreglo para almacenar las capacidades de la API getCapacidades
  Capacidades: CapacidadesModel[] = [];

constructor(
    private ubicacionesService: UbicacionesService, 
    private TipoEventoService: TipoEventoService, 
    private OrganizadorService: OrganizadorService,
    private CapacidadesService: CapacidadesService,

    ) 
    { }

  ngOnInit(): void {
    this.getUbicaciones();
    this.getTipoEvento();
    this.getOrganizador();
    this.getCapacidades();
   

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

  // Funcion para consumir el servicio de Tipos Evento disponibles
  getOrganizador(): void {
    this.OrganizadorService.getOrganizador().subscribe({
      next: (data) => this.Organizadores = data,
      error: (err) => console.error('Error al cargar ubicaciones', err)
    });
  }

  // Funcion para consumir el servicio de capacidades disponibles
  getCapacidades(): void {
    this.CapacidadesService.getCapacidades().subscribe({
      next: (data) => this.Capacidades = data,
      error: (err) => console.error('Error al cargar Capacidades', err)
    });
  }

}
