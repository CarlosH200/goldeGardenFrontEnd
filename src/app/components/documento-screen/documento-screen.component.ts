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
import { ThemeService } from '../../services/theme.service';
import { EstadoService } from '../../services/estadoService';
import { EstadosModel } from '../../models/estadoModel';
import { ClienteModel } from '../../models/clienteModel';


@Component({
  selector: 'app-documento-screen',
  imports: [FormsModule, CommonModule],
  templateUrl: './documento-screen.component.html',
  styleUrl: './documento-screen.component.css'
})
export class DocumentoScreenComponent {

  // Modelo para datos del cliente
  clienteForm: Partial<ClienteModel> = {
    nit: '',
    nombre: '',
    apellido: '',
    email: '',
    dpi: '',
    direccion: '',
    telefono: '',
    celular: '',
    tipoCliente: 1,
    observacion01: '',
    observacion02: ''
  };
  // Variable para desplegar inputs para crear cliente
  dataCreateClient: number = 0;
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
  pUbicacionEvento: number = 1;
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
  // Arreglo para almacenar lso estados del API getEstados
  Estados: EstadosModel[] = [];

  constructor(
    private ubicacionesService: UbicacionesService,
    private TipoEventoService: TipoEventoService,
    private OrganizadorService: OrganizadorService,
    private CapacidadesService: CapacidadesService,
    private EstadosService: EstadoService,
    public theme: ThemeService,

  ) { }

  ngOnInit(): void {
    this.getUbicaciones();
    this.getTipoEvento();
    this.getOrganizador();
    this.getCapacidades();
    this.getEstados();
  }

guardarCliente(): void {

  const clienteGuardar: ClienteModel = {
    ...this.clienteForm as ClienteModel, // casteo seguro
    estado: 1,
    fechaRegistro: new Date().toISOString(),
    // username: this.usuarioActual  // pendiente de implementar
  };

  console.log(clienteGuardar);

  // aquí llamas a tu servicio HTTP
}

  // Funcion para mostrar inputs de crear cliente
  showCreateClient(): void {
    this.dataCreateClient = 1;
  }

  // Funcion para ocultar inputs de crear cliente
  hideCreateClient(): void {
    this.dataCreateClient = 0;
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

  // Funcion para consumir el servicio de capacidades disponibles
  getEstados(): void {
    this.EstadosService.getEstados().subscribe({
      next: (data) => this.Estados = data,
      error: (err) => console.error('Error al cargar Estados', err)
    });
  }




}
