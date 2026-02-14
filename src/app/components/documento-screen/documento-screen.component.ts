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
import { ClientesService } from '../../services/cliente.service';
import { ClienteCreateRequest } from '../../models/clienteCreateRequest';
import { AlertGenericComponent } from '../alert-generic/alert-generic.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

// ✅ NUEVO IMPORT

@Component({
  selector: 'app-documento-screen',
  imports: [FormsModule, CommonModule, MatIconModule,],
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
    observacion02: '',
    estado: 1, // Agregado para mostrar en el modal, aunque tu API lo maneje internamente
    fechaRegistro: new Date().toLocaleDateString() // Solo para mostrar en el modal, tu API debería manejar la fecha real
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
    public dialog: MatDialog,

    // ✅ NUEVO SERVICE
    private clientesService: ClientesService,
  ) { }

  ngOnInit(): void {
    this.getUbicaciones();
    this.getTipoEvento();
    this.getOrganizador();
    this.getCapacidades();
    this.getEstados();
  }

  // ==========================================================
  // BLOQUE GUARDAR CLIENTE
  // ==========================================================
  guardarCliente(): void {

    //Validaciones mínimas (para evitar error @Tipo_Cliente)
    //

    // Valida que el nit tenga contenido y no sea solo espacios con la nueva alerta generica integrada
    if (!this.clienteForm.nit || this.clienteForm.nit.trim() === '') {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'El NIT es obligatorio y debe contener caracteres válidos.',
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'NIT Actual', valor: this.clienteForm.nit },
          ]
        }
      });

      return;
    }

    // Valida que el nombre se ingrese y sea valido (no solo espacios) con la nueva alerta generica integrada
    if (!this.clienteForm.nombre || this.clienteForm.nombre.trim() === '') {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'El Nombre es obligatorio y debe contener caracteres válidos.',
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'Nombre Actual', valor: this.clienteForm.nombre },
          ]
        }
      });
      return;
    }

    // VALIDACION DEL TIPO CLIENTE: Asegura que se haya seleccionado un tipo cliente válido (no nulo, no vacío, no cero)
    if (!this.clienteForm.tipoCliente || this.clienteForm.tipoCliente <= 0) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'Debe seleccionar un Tipo Cliente válido.',
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'Tipo Cliente Actual', valor: this.clienteForm.tipoCliente },
          ]
        }
      });
      return;
    }

    //LIMPIEZA de datos para BIGINT (evita error nvarchar -> bigint)
    const nitRaw = (this.clienteForm.nit ?? '').trim();
    const nitLimpio = /^c\s*\/?\s*f$/i.test(nitRaw)
      ? 'C/F'
      : nitRaw.replace(/\D/g, '');

    const telLimpio = (this.clienteForm.telefono ?? '').replace(/\D/g, '');
    const celLimpio = (this.clienteForm.celular ?? '').replace(/\D/g, '');

    // ⚠️ Si queda vacío después de limpiar, no lo mandes vacío
    if (!nitLimpio) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos el NIT debe ser numérico.',
          mensaje: 'NIT Actual: ' + this.clienteForm.nit,
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'NIT Actual', valor: this.clienteForm.nit },
          ]
        }
      });
      return;
    }

    // ==========================================================
    // ✅ 3) ARMAMOS EL BODY EXACTO QUE TU API ESPERA
    // ==========================================================
    const body: ClienteCreateRequest = {
      nit: nitLimpio,
      nombre: (this.clienteForm.nombre ?? '').trim(),
      apellido: (this.clienteForm.apellido ?? '').trim(),
      email: (this.clienteForm.email ?? '').trim(),
      dpi: (this.clienteForm.dpi ?? '').trim(),
      direccion: (this.clienteForm.direccion ?? '').trim(),
      telefono: telLimpio || '0',
      celular: celLimpio || '0',
      tipoCliente: Number(this.clienteForm.tipoCliente),
      observacion01: (this.clienteForm.observacion01 ?? '').trim(),
      observacion02: (this.clienteForm.observacion02 ?? '').trim(),

      //IMPORTANTE: el API lo requiere para funcionar
      // Por ahora es un dato quemado hasta consumir el AuthService y parametrizarlo con el usuario real que hace la petición
      username: 'admin'
    };

    console.log('Body enviado a API:', body);

    // ==========================================================
    // CONSUMO DE SERVICIO CREAR CLIENTE (api crear cliente)
    // ==========================================================
    this.clientesService.insertCliente(body).subscribe({
      next: (res) => {
        if (res?.success) {
          // 1. Abrimos el modal con la estructura genérica que definimos
          this.dialog.open(AlertGenericComponent, {
            width: '450px',
            data: {
              titulo: 'Cliente Creado Correctamente',
              mensaje: res.mensaje || 'Los datos del cliente han sido almacenados.',
              tipo: 'success', // Controla el tipo de mensaje (puedes usar esto para cambiar colores o íconos en el modal)
              icon: 'check_circle', // Icono de éxito
              detalles: [
                { etiqueta: 'NIT', valor: this.clienteForm.nit },
                { etiqueta: 'Nombre', valor: `${this.clienteForm.nombre} ${this.clienteForm.apellido}` },
                { etiqueta: 'Correo', valor: this.clienteForm.email },
                { etiqueta: 'Telefono', valor: `${this.clienteForm.telefono}  /  ${this.clienteForm.celular}` },
                { etiqueta: 'Estado', valor: this.clienteForm.estado },
                { etiqueta: 'Fecha Creación', valor: this.clienteForm.fechaRegistro },

              ]
            }
          });

          //Limpia el formulario de cliente al guardar
          this.clienteForm = {
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

          // OCULTA LOS INPUTS LUEGO DE QUE SE GUARDO EL NUEVO CLIENTE
          this.dataCreateClient = 0;

        } else {
          alert(res?.mensaje || 'No se pudo guardar el cliente');
          console.error('Respuesta API:', res);
        }
      },
      error: (err) => {
        console.error('Error API:', err);

        // Si el backend manda error detallado:
        const msg = err?.error?.mensaje || 'Error al conectar con el servidor';
        // alert(msg);
        this.dialog.open(AlertGenericComponent, {
          width: '450px',
          data: {
            titulo: 'Error al Crear Cliente',
            mensaje: msg.mensaje || 'Error sin descripcion.',
            tipo: 'error', // Controla el tipo de mensaje (puedes usar esto para cambiar colores o íconos en el modal)
            icon: 'error', // Icono de error
            detalles: [
              { etiqueta: 'NIT', valor: this.clienteForm.nit },
              { etiqueta: 'Nombre', valor: `${this.clienteForm.nombre} ${this.clienteForm.apellido}` },
              { etiqueta: 'Correo', valor: this.clienteForm.email },
              { etiqueta: 'Telefono', valor: `${this.clienteForm.telefono}  /  ${this.clienteForm.celular}` },
              { etiqueta: 'Estado', valor: this.clienteForm.estado },
              { etiqueta: 'Fecha Creación', valor: this.clienteForm.fechaRegistro },

            ]
          }
        });
      }
    });
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
