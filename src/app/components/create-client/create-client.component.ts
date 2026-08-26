import { Component, EventEmitter, Output } from '@angular/core';
import { ClienteModel } from '../../models/clienteModel';
import { ClientesService } from '../../services/cliente.service';
import { AuthService } from '../../services/authService';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AlertGenericComponent } from '../alert-generic/alert-generic.component';
import { ClienteCreateRequest } from '../../models/clienteCreateRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './create-client.component.html',
  styleUrl: './create-client.component.css'
})
export class CreateClientComponent {

  // ==========================================================
  // BUSQUEDA DE CLIENTES
  // ==========================================================

  clientesEncontrados: ClienteModel[] = [];

  busquedaCliente: string = '';

  clienteSeleccionado: ClienteModel | null = null;


  // ==========================================================
  // FORMULARIO DE CLIENTE
  // ==========================================================

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

    estado: 1,

    fecha_Registro: new Date().toLocaleDateString(),

  };


  // ==========================================================
  // EVENTO PARA DEVOLVER CLIENTE SELECCIONADO
  // ==========================================================

  @Output()
  clienteCompletoChange =
    new EventEmitter<ClienteModel>();


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}


  // ==========================================================
  // BUSCAR CLIENTES
  // ==========================================================

  buscarClientes(): void {

    this.clienteSeleccionado = null;

    if (
      !this.busquedaCliente ||
      this.busquedaCliente.trim() === ''
    ) {

      this.clientesEncontrados = [];

      return;
    }


    this.clientesService
      .buscarClientes(
        this.busquedaCliente.trim()
      )
      .subscribe({

        next: (res) => {

          if (res?.success) {

            this.clientesEncontrados =
              res.data ?? [];

          } else {

            this.clientesEncontrados = [];

          }

        },

        error: (err) => {

          console.error(
            'Error al buscar clientes:',
            err
          );

          this.clientesEncontrados = [];

        }

      });

  }


  // ==========================================================
  // SELECCIONAR CLIENTE
  // ==========================================================

  seleccionarCliente(
    cliente: ClienteModel
  ): void {

    // Guardar cliente seleccionado
    this.clienteSeleccionado = cliente;


    // ========================================================
    // CARGAR TODA LA INFORMACIÓN DEL CLIENTE
    // DIRECTAMENTE EN EL FORMULARIO
    // ========================================================

    this.clienteForm = {

      nit:
        cliente.nit ?? '',

      nombre:
        cliente.nombre ?? '',

      apellido:
        cliente.apellido ?? '',

      email:
        cliente.email ?? '',

      dpi:
        cliente.dpi ?? '',

      direccion:
        cliente.direccion ?? '',

      telefono:
        cliente.telefono ?? '',

      celular:
        cliente.celular ?? '',

      tipoCliente:
        cliente.tipoCliente ?? 1,

      observacion01:
        cliente.observacion01 ?? '',

      observacion02:
        cliente.observacion02 ?? '',

      estado:
        cliente.estado ?? 1,

      fecha_Registro:
        cliente.fecha_Registro ??
        new Date().toLocaleDateString(),

    };


    // Ocultar resultados
    this.clientesEncontrados = [];


    // Limpiar campo de búsqueda
    this.busquedaCliente = '';


    // Emitir cliente seleccionado
    this.clienteCompletoChange.emit(
      cliente
    );

  }


  // ==========================================================
  // CANCELAR / LIMPIAR FORMULARIO
  // ==========================================================

  cancelarFormulario(): void {

    this.clientesEncontrados = [];

    this.busquedaCliente = '';

    this.clienteSeleccionado = null;


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
      observacion02: '',

      estado: 1,

      fecha_Registro:
        new Date().toLocaleDateString(),

    };

  }


  // ==========================================================
  // GUARDAR CLIENTE
  // ==========================================================

  guardarCliente(): void {


    // ========================================================
    // VALIDAR NIT
    // ========================================================

    if (
      !this.clienteForm.nit ||
      this.clienteForm.nit.trim() === ''
    ) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos incompletos',

            mensaje:
              'El NIT es obligatorio y debe contener caracteres válidos.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'NIT Actual',

                valor:
                  this.clienteForm.nit
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // VALIDAR TELÉFONO / CELULAR
    // ========================================================

    if (

      (
        !this.clienteForm.telefono ||
        this.clienteForm.telefono.trim() === ''
      )

      &&

      (
        !this.clienteForm.celular ||
        this.clienteForm.celular.trim() === ''
      )

    ) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos incompletos',

            mensaje:
              'El Teléfono o Celular es obligatorio y debe contener caracteres válidos.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'Teléfono Actual',

                valor:
                  this.clienteForm.telefono
              },

              {
                etiqueta:
                  'Celular Actual',

                valor:
                  this.clienteForm.celular
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // VALIDAR NOMBRE
    // ========================================================

    if (

      !this.clienteForm.nombre ||
      this.clienteForm.nombre.trim() === ''

    ) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos incompletos',

            mensaje:
              'El Nombre es obligatorio y debe contener caracteres válidos.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'Nombre Actual',

                valor:
                  this.clienteForm.nombre
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // VALIDAR APELLIDO
    // ========================================================

    if (

      !this.clienteForm.apellido ||
      this.clienteForm.apellido.trim() === ''

    ) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos incompletos',

            mensaje:
              'El Apellido es obligatorio y debe contener caracteres válidos.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'Apellido Actual',

                valor:
                  this.clienteForm.apellido
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // VALIDAR DIRECCIÓN
    // ========================================================

    if (

      !this.clienteForm.direccion ||
      this.clienteForm.direccion.trim() === ''

    ) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos incompletos',

            mensaje:
              'La Dirección es obligatoria y debe contener caracteres válidos.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'Dirección Actual',

                valor:
                  this.clienteForm.direccion
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // VALIDAR TIPO CLIENTE
    // ========================================================

    if (

      !this.clienteForm.tipoCliente ||
      this.clienteForm.tipoCliente <= 0

    ) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos incompletos',

            mensaje:
              'Debe seleccionar un Tipo Cliente válido.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'Tipo Cliente Actual',

                valor:
                  this.clienteForm.tipoCliente
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // LIMPIAR DATOS
    // ========================================================

    const nitRaw =
      (
        this.clienteForm.nit ?? ''
      ).trim();


    const nitLimpio =
      /^c\s*\/?\s*f$/i.test(nitRaw)

        ? 'C/F'

        : nitRaw.replace(
            /\D/g,
            ''
          );


    const telLimpio =
      (
        this.clienteForm.telefono ?? ''
      ).replace(
        /\D/g,
        ''
      );


    const celLimpio =
      (
        this.clienteForm.celular ?? ''
      ).replace(
        /\D/g,
        ''
      );


    // ========================================================
    // VALIDAR NIT LIMPIO
    // ========================================================

    if (!nitLimpio) {

      this.dialog.open(
        AlertGenericComponent,
        {

          width: '450px',

          data: {

            titulo:
              'Datos',

            mensaje:
              'El NIT debe ser numérico.',

            tipo:
              'warning',

            icon:
              'warning',

            detalles: [

              {
                etiqueta:
                  'NIT Actual',

                valor:
                  this.clienteForm.nit
              }

            ],

          },

        }
      );

      return;

    }


    // ========================================================
    // BODY PARA API
    // ========================================================

    const body: ClienteCreateRequest = {

      nit:
        nitLimpio,

      nombre:
        (
          this.clienteForm.nombre ?? ''
        ).trim(),

      apellido:
        (
          this.clienteForm.apellido ?? ''
        ).trim(),

      email:
        (
          this.clienteForm.email ??
          'correo@generico.com'
        ).trim(),

      dpi:
        (
          this.clienteForm.dpi ??
          '0000000000000'
        ).trim(),

      direccion:
        (
          this.clienteForm.direccion ?? ''
        ).trim(),

      telefono:
        telLimpio ||
        '00000000',

      celular:
        celLimpio ||
        '00000000',

      tipoCliente:
        Number(
          this.clienteForm.tipoCliente ?? 1
        ),

      observacion01:
        (
          this.clienteForm.observacion01 ?? ''
        ).trim(),

      observacion02:
        (
          this.clienteForm.observacion02 ?? ''
        ).trim(),

      username:
        this.authService.getUsername(),

    };


    // ========================================================
    // INSERTAR CLIENTE
    // ========================================================

    this.clientesService
      .insertCliente(body)
      .subscribe({

        next: (res) => {

          if (res?.success) {

            this.dialog.open(
              AlertGenericComponent,
              {

                width: '450px',

                data: {

                  titulo:
                    'Cliente Creado Correctamente',

                  mensaje:
                    res.mensaje ||
                    'Los datos del cliente han sido almacenados.',

                  tipo:
                    'success',

                  icon:
                    'check_circle',

                  detalles: [

                    {
                      etiqueta:
                        'NIT',

                      valor:
                        this.clienteForm.nit
                    },

                    {
                      etiqueta:
                        'Nombre',

                      valor:
                        `${this.clienteForm.nombre} ${this.clienteForm.apellido}`
                    },

                    {
                      etiqueta:
                        'Correo',

                      valor:
                        this.clienteForm.email
                    },

                    {
                      etiqueta:
                        'Telefono',

                      valor:
                        `${this.clienteForm.telefono} / ${this.clienteForm.celular}`
                    },

                    {
                      etiqueta:
                        'Estado',

                      valor:
                        this.clienteForm.estado
                    },

                    {
                      etiqueta:
                        'Fecha Creación',

                      valor:
                        this.clienteForm.fecha_Registro
                    }

                  ],

                },

              }
            );


            // Limpiar formulario
            this.cancelarFormulario();


          } else {

            alert(
              res?.mensaje ||
              'No se pudo guardar el cliente'
            );

          }

        },


        // ====================================================
        // ERROR API
        // ====================================================

        error: (err) => {

          console.error(
            'Error API:',
            err
          );


          const msg =
            err?.error?.mensaje ||
            'Error al conectar con el servidor';


          this.dialog.open(
            AlertGenericComponent,
            {

              width: '450px',

              data: {

                titulo:
                  'Error al Crear Cliente',

                mensaje:
                  typeof msg === 'string'
                    ? msg
                    : 'Error sin descripción.',

                tipo:
                  'error',

                icon:
                  'error',

                detalles: [

                  {
                    etiqueta:
                      'NIT',

                    valor:
                      this.clienteForm.nit
                  },

                  {
                    etiqueta:
                      'Nombre',

                    valor:
                      `${this.clienteForm.nombre} ${this.clienteForm.apellido}`
                  },

                  {
                    etiqueta:
                      'Correo',

                    valor:
                      this.clienteForm.email
                  },

                  {
                    etiqueta:
                      'Telefono',

                    valor:
                      `${this.clienteForm.telefono} / ${this.clienteForm.celular}`
                  },

                  {
                    etiqueta:
                      'Estado',

                    valor:
                      this.clienteForm.estado
                  },

                  {
                    etiqueta:
                      'Fecha Creación',

                    valor:
                      this.clienteForm.fecha_Registro
                  }

                ],

              },

            }
          );

        }

      });

  }

}