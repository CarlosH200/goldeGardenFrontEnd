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
import { EventosService } from '../../services/eventosService';
import { AuthService } from '../../services/authService';

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
    fecha_Registro: new Date().toLocaleDateString() // Solo para mostrar en el modal, tu API debería manejar la fecha real
  };

  // VARIABLE PARA ALMACENAR EL ID DEL EVENTO CREADO
  idEventoCreado: number | null = null;
  // VARIABLES PARA BUSQUEDA DE CLIENTES
  // Array para almacenar los clientes encontrados en la búsqueda
  clientesEncontrados: ClienteModel[] = [];
  // variable para almacenar el texto de búsqueda del cliente
  busquedaCliente: string = '';
  // array para almacenar el cliente seleccionado de la búsqueda (inicialmente null)
  clienteSeleccionado: ClienteModel | null = null;
  // Variable para desplegar inputs para crear cliente
  dataCreateClient: number = 0;
  // Vaiable para almacenar el titulo del evento
  pTituloEvento: string = '';
  // Variable para almacenar la descripcion del evento
  pDescripcionEvento: string = '';
  // Variable para almacenar la fecha de entrega del evento
  pFechaEntregaEvento: string = this.getFechaConHora(7, 0);
  // Variable para almacenar la fecha de recoger del evento
  pFechaRecogerEvento: string = this.getFechaConHora(23, 0);
  // Variable para almacenar la fecha de inicio del evento
  pFechaInicioEvento: string = this.getFechaConHora(6, 0);
  // Variable para almacenar la fecha de fin del evento
  pFechaFinEvento: string = this.getFechaConHora(23, 59);
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
    private eventosService: EventosService,
    private ubicacionesService: UbicacionesService,
    private TipoEventoService: TipoEventoService,
    private OrganizadorService: OrganizadorService,
    private CapacidadesService: CapacidadesService,
    private EstadosService: EstadoService,
    public theme: ThemeService,
    public dialog: MatDialog,
    private authService: AuthService,

    //NUEVO SERVICE
    private clientesService: ClientesService,
  ) { }

  ngOnInit(): void {
    this.getUbicaciones();
    this.getTipoEvento();
    this.getOrganizador();
    this.getCapacidades();
    this.getEstados();
  }


  // FUNCION PARA OBTENER LA FECHA DE HOY EN FORMATO YYYY-MM-DD PARA LOS INPUTS DE FECHA
  getFechaConHora(hora: number, minutos: number): string {
    const now = new Date();

    now.setHours(hora, minutos, 0, 0);

    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
  }


  // INICIO FUNCION PARA GUARDAR EVENTO
  guardarEvento(): void {

    if (!this.pTituloEvento || this.pTituloEvento.trim() === '') {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'El título del evento es obligatorio.',
          tipo: 'warning',
          icon: 'warning'
        }
      });
      return;
    }

    if (!this.clienteSeleccionado) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Cliente requerido',
          mensaje: 'Debes seleccionar un cliente.',
          tipo: 'warning',
          icon: 'warning'
        }
      });
      return;
    }

    const body = {
      titulo: this.pTituloEvento,
      descripcion: this.pDescripcionEvento,

      fecha_Ini: this.pFechaInicioEvento,
      fecha_Fin: this.pFechaFinEvento,
      fecha_Entrega: this.pFechaEntregaEvento,
      fecha_Recepcion: this.pFechaRecogerEvento,

      ubicacion: this.pUbicacionEvento,
      organizador: this.pOrganizadorEvento,
      tipo_Evento: this.pTipoEvento,
      capacidad_Evento: this.pCapacidadEvento,

      observacion: this.pDetallesEvento,

      url_Evento: this.pTituloEvento.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),

      username: this.authService.getUsername(),

      id_cliente: this.clienteSeleccionado.id
    };

    console.log('BODY EVENTO:', body);

    this.eventosService.insertarEvento(body).subscribe({
      next: (res) => {
        if (res.success) {

          const idEvento = res.id;

          // AQUÍ GUARDAS EL ID PARA MOSTRARLO EN PANTALLA
          this.idEventoCreado = idEvento;
          // NUEVO
          this.cargarEventoPorId(idEvento);
          console.log('ID EVENTO:', idEvento);

          this.dialog.open(AlertGenericComponent, {
            width: '450px',
            data: {
              titulo: 'Evento creado',
              mensaje: res.mensaje,
              tipo: 'success',
              icon: 'check_circle',
              detalles: [
                { etiqueta: 'ID Evento', valor: idEvento },
                { etiqueta: 'Título', valor: this.pTituloEvento }
              ]
            }
          });

          // 🔥 FUTURO: documentos
          // this.subirDocumento(idEvento);

        } else {
          console.error(res);
        }
      },
      error: (err) => {
        console.error(err);

        this.dialog.open(AlertGenericComponent, {
          width: '450px',
          data: {
            titulo: 'Error',
            mensaje: err?.error?.mensaje || 'Error al guardar evento',
            tipo: 'error',
            icon: 'error'
          }
        });
      }
    });
  }
  // FIN FUNCION PARA GUARDAR EVENTO


  // FUNCION PARA LLAMMAR A CARGAR EVENTO POR ID Y MOSTRARLO EN PANTALLA (SE PUEDE USAR PARA MOSTRAR LOS DATOS DE UN EVENTO RECIEN CREADO O PARA BUSCAR CUALQUIER EVENTO POR SU ID)
  buscarEvento(): void {
    if (!this.idEventoCreado) {
      console.warn('Debes ingresar un ID');
      return;
    }

    this.cargarEventoPorId(this.idEventoCreado);
  }

  // ==========================================================
  // CARGAR EVENTO POR ID (CON CLIENTE)
  // ==========================================================
  cargarEventoPorId(id: number | null): void {

    if (!id) return;

    this.eventosService.obtenerEvento(id).subscribe({
      next: (res: any) => {

        if (res?.success && res?.data) {

          const evento = res.data;

          console.log('EVENTO CARGADO:', evento);

          // =========================
          // EVENTO
          // =========================
          this.pTituloEvento = evento.titulo;
          this.pDescripcionEvento = evento.descripcion;

          this.pFechaInicioEvento = this.formatearFecha(evento.fecha_Ini);
          this.pFechaFinEvento = this.formatearFecha(evento.fecha_Fin);
          this.pFechaEntregaEvento = this.formatearFecha(evento.fecha_Entrega);
          this.pFechaRecogerEvento = this.formatearFecha(evento.fecha_Recepcion);

          this.pUbicacionEvento = evento.ubicacion;
          this.pOrganizadorEvento = evento.organizador;
          this.pTipoEvento = evento.tipo_Evento;
          this.pCapacidadEvento = evento.capacidad_Evento;

          this.pDetallesEvento = evento.observacion || '';

          // =========================
          // CLIENTE (SIN MÉTODO INEXISTENTE)
          // =========================
          const idCliente = evento.id_cliente;

          if (idCliente) {

            this.clientesService.buscarClientes(idCliente).subscribe({
              next: (resCli: any) => {

                if (resCli?.success && resCli?.data?.length > 0) {

                  // tomamos el primero si viene como lista
                  this.clienteSeleccionado = resCli.data[0];

                  console.log('CLIENTE CARGADO:', this.clienteSeleccionado);
                } else {
                  this.clienteSeleccionado = null;
                }

              },
              error: (err: any) => {
                console.error('Error al cargar cliente', err);
                this.clienteSeleccionado = null;
              }
            });

          } else {
            this.clienteSeleccionado = null;
          }

        }

      },
      error: (err: any) => {
        console.error('Error al cargar evento', err);
      }
    });
  }

  // FUNCION QUE FORMATEA LAS FECHAS QUE VIENEN DE LA API PARA MOSTRARLAS EN LOS INPUTS DE FECHA}
  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    const date = new Date(fecha);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
  }
  // FIN FUNCION QUE FORMATEA LAS FECHAS QUE VIENEN DE LA API PARA MOSTRARLAS EN LOS INPUTS DE FECHA

  // FUNCION PARA BUSCAR CLIENTES CON EL NUEVO METODO EN EL SERVICE
  buscarClientes(): void {

    // limpia el cliente seleccionado cada vez que se hace una nueva búsqueda para evitar confusiones si el usuario cambia de opinión o busca otro cliente
    this.clienteSeleccionado = null;

    if (!this.busquedaCliente || this.busquedaCliente.trim() === '') {
      return;
    }

    this.clientesService.buscarClientes(this.busquedaCliente).subscribe({
      next: (res) => {
        if (res?.success) {
          this.clientesEncontrados = res.data;
          console.log('Clientes encontrados:', this.clientesEncontrados);
        } else {
          this.clientesEncontrados = [];
        }
      },
      error: (err) => {
        console.error('Error al buscar clientes', err);
        this.clientesEncontrados = [];
      }
    });
  }

  seleccionarCliente(cliente: ClienteModel): void {
    this.clienteSeleccionado = cliente;

    // Limpia resultados (oculta lista)
    this.clientesEncontrados = [];

    // Limpia input si quieres
    this.busquedaCliente = '';
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

    // Valida que el TRelefono o Telefono tenga contenido y no sea solo espacios con la nueva alerta generica integrada
    if (
      (!this.clienteForm.telefono || this.clienteForm.telefono.trim() === '') &&
      (!this.clienteForm.celular || this.clienteForm.celular.trim() === '')
    ) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'El Teléfono o Celular es obligatorio y debe contener caracteres válidos.',
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'Teléfono Actual', valor: this.clienteForm.telefono },
            { etiqueta: 'Celular Actual', valor: this.clienteForm.celular },
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

    // Valida que el Apellido se ingrese y sea valido (no solo espacios) con la nueva alerta generica integrada
    if (!this.clienteForm.apellido || this.clienteForm.apellido.trim() === '') {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'El Apellido es obligatorio y debe contener caracteres válidos.',
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'Apellido Actual', valor: this.clienteForm.apellido },
          ]
        }
      });
      return;
    }

    // Valida que la Direccion se ingrese y sea valido (no solo espacios) con la nueva alerta generica integrada
    if (!this.clienteForm.direccion || this.clienteForm.direccion.trim() === '') {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Datos incompletos',
          mensaje: 'La Dirección es obligatoria y debe contener caracteres válidos.',
          tipo: 'warning',
          icon: 'warning',
          detalles: [
            { etiqueta: 'Dirección Actual', valor: this.clienteForm.direccion },
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

    // VALIDACION PARA EVITAR ENVIAR NIT VACIO
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
    // BODY QUE ESPERA EL API INSERT CLIENTE
    // ==========================================================
    const body: ClienteCreateRequest = {
      nit: nitLimpio,
      nombre: (this.clienteForm.nombre ?? '').trim(),
      apellido: (this.clienteForm.apellido ?? '').trim(),
      email: (this.clienteForm.email ?? 'correo@generico.com').trim(),
      dpi: (this.clienteForm.dpi ?? '0000000000000').trim(),
      direccion: (this.clienteForm.direccion ?? '').trim(),
      telefono: telLimpio || '00000000',
      celular: celLimpio || '00000000',
      tipoCliente: Number(this.clienteForm.tipoCliente ?? 1), // Asegura que siempre se envíe un número válido, por defecto 1
      observacion01: (this.clienteForm.observacion01 ?? '').trim(),
      observacion02: (this.clienteForm.observacion02 ?? '').trim(),

      //IMPORTANTE: el API lo requiere para funcionar
      // Por ahora es un dato quemado hasta consumir el AuthService y parametrizarlo con el usuario real que hace la petición
      username: this.authService.getUsername(),
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
                { etiqueta: 'Fecha Creación', valor: this.clienteForm.fecha_Registro },

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
              { etiqueta: 'Fecha Creación', valor: this.clienteForm.fecha_Registro },

            ]
          }
        });
      }
    });
  }

  // Funcion para mostrar inputs de crear cliente
  showCreateClient(): void {
    this.clienteSeleccionado = null;
    this.dataCreateClient = 1;
  }

  // Funcion para ocultar inputs de crear cliente
  hideCreateClient(): void {
    this.clientesEncontrados = [];
    this.clienteSeleccionado = null;
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
