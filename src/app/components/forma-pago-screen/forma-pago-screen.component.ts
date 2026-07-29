import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormaPagoModel } from '../../models/formaPagoModel';
import { FormaPagoService } from '../../services/formaPagoService';
import { TipoMovimientoModel } from '../../models/tipoMovimientoModel';
import { TipoMovimientoService } from '../../services/tipoMovimientoService';
import { BancoModel } from '../../models/bancoModel';
import { BancoService } from '../../services/bancoService';
import { CuentaBancariaModel } from '../../models/cuentaBancariaModel';
import { CuentaBancariaService } from '../../services/cuentaBancariaService';
import { PagoModel } from '../../models/pagoModel';
import { PagosService } from '../../services/pagosService';

@Component({
  selector: 'app-forma-pago-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './forma-pago-screen.component.html',
  styleUrl: './forma-pago-screen.component.css'
})
export class FormaPagoScreenComponent
implements OnInit, OnChanges {

  @Input() idEvento: number | null = null;

  @Input() cliente: any = null;

  @Input() totalTransaccion = 0;

  formaPagoSeleccionada = '';

  montoPago = 0;

  referencia = '';

  autorizacion = '';

  bancoOrigen = '';

  cuentaDestino = '';

  pagos: PagoModel[] = [];

  formasPago: FormaPagoModel[] = [];

  tiposMovimiento: TipoMovimientoModel[] = [];

  tipoMovimientoSeleccionado = '';

  cuentasEmpresa: CuentaBancariaModel[] = [];

  cuentaSeleccionada = '';

  bancos: BancoModel[] = [];

  bancoSeleccionado = '';


  constructor(
    private formaPagoService: FormaPagoService,
    private tipoMovimientoService: TipoMovimientoService,
    private bancoService: BancoService,
    private cuentaBancariaService: CuentaBancariaService,
    private pagosService: PagosService,
  ) { }
 

  ngOnChanges(changes: SimpleChanges): void {

  if (changes['idEvento']) {

    if (this.idEvento) {

      this.cargarPagos();

    }

  }

  if (changes['cliente']) {

    console.log(
      'CLIENTE RECIBIDO EN FORMA PAGO:',
      this.cliente
    );

  }

}

ngOnInit(): void {

  this.cargarFormasPago();

  this.cargarTiposMovimiento();

  this.cargarBancos();

}

  

  cargarPagos(): void {

    if (!this.idEvento) {
      return;
    }

    this.pagosService
      .obtenerPagos(this.idEvento)
      .subscribe({

        next: (response) => {

          this.pagos = response.data;

        },

        error: (error) => {

          console.error(
            'Error cargando pagos',
            error
          );

        }

      });

  }

  private establecerValoresPorDefecto(): void {

    this.formaPagoSeleccionada =
      (this.formasPago[0]?.id ?? '')
        .toString();

    const anticipo = this.tiposMovimiento.find(
      x => x.descripcion === 'ANTICIPO'
    );

    this.tipoMovimientoSeleccionado =
      (anticipo?.id ?? this.tiposMovimiento[0]?.id ?? '')
        .toString();

    this.bancoSeleccionado =
      (this.bancos[0]?.id ?? '')
        .toString();

    this.cuentaSeleccionada =
      (this.cuentasEmpresa[0]?.id ?? '')
        .toString();

  }


  cargarCuentasBancarias(
    idBanco: number
  ): void {

    this.cuentaBancariaService
      .getCuentasBancarias(idBanco)
      .subscribe({

        next: (response) => {

          this.cuentasEmpresa = response;

          if (this.cuentasEmpresa.length > 0) {

            this.cuentaSeleccionada =
              this.cuentasEmpresa[0].id.toString();

          }
          else {

            this.cuentaSeleccionada = '';

          }
        },

        error: (error) => {

          console.error(
            'Error cargando cuentas bancarias',
            error
          );

        }

      });

  }

  cargarBancos(): void {

    this.bancoService
      .getBancos()
      .subscribe({

        next: (response) => {

          this.bancos = response;

          if (this.bancos.length > 0) {

            this.bancoSeleccionado =
              this.bancos[0].id.toString();

            this.bancoOrigen =
              this.bancos[0].descripcion;

            this.cargarCuentasBancarias(
              this.bancos[0].id
            );

          }

        },

        error: (error) => {

          console.error(
            'Error cargando bancos',
            error
          );

        }

      });

  }

  onBancoChange(): void {

    const banco = this.bancos.find(
      x => x.id === Number(this.bancoSeleccionado)
    );

    this.bancoOrigen =
      banco?.descripcion ?? '';

    this.cargarCuentasBancarias(
      Number(this.bancoSeleccionado)
    );

  }

  get bancoActual(): BancoModel | undefined {

    return this.bancos.find(
      x => x.id === Number(this.bancoSeleccionado)
    );

  }

  get cuentaActual(): CuentaBancariaModel | undefined {

    return this.cuentasEmpresa.find(
      x => x.id === Number(this.cuentaSeleccionada)
    );

  }


  cargarTiposMovimiento(): void {

    this.tipoMovimientoService
      .getTiposMovimiento()
      .subscribe({

        next: (response) => {

          this.tiposMovimiento = response;

          // DEFAULT: ANTICIPO (recomendado negocio)
          const anticipo = this.tiposMovimiento.find(
            x => x.descripcion === 'ANTICIPO'
          );

          this.tipoMovimientoSeleccionado =
            (anticipo?.id ?? this.tiposMovimiento[0]?.id ?? '')
              .toString();

        },

        error: (error) => {

          console.error(
            'Error cargando tipos de movimiento',
            error
          );

        }

      });

  }

  cargarFormasPago(): void {

    this.formaPagoService
      .getFormasPago()
      .subscribe({

        next: (response) => {

          this.formasPago = response;

          // DEFAULT: primera forma activa
          this.formaPagoSeleccionada =
            (this.formasPago[0]?.id ?? '')
              .toString();

        },

        error: (error) => {

          console.error(
            'Error cargando formas de pago',
            error
          );

        }

      });

  }

  get formaPagoActual(): FormaPagoModel | undefined {

    return this.formasPago.find(
      x => x.id === Number(this.formaPagoSeleccionada)
    );

  }

  get mostrarBanco(): boolean {

    return this.formaPagoActual?.posee_Banco ?? false;

  }

  get mostrarCuentaBancaria(): boolean {

    return this.formaPagoActual?.posee_Cuenta_Bancaria ?? false;

  }

  get mostrarReferencia(): boolean {

    return this.formaPagoActual?.posee_Referencia ?? false;

  }

  get mostrarAutorizacion(): boolean {

    return this.formaPagoActual?.posee_Autorizarion ?? false;

  }

  agregarPago(): void {

    if (!this.idEvento) {
      console.error('No se recibió el id del evento.');
      return;
    }

    if (!this.cliente) {
      console.error('No se recibió el cliente.');
      return;
    }

    if (!this.formaPagoSeleccionada) {
      console.error('Debe seleccionar una forma de pago.');
      return;
    }

    const body = {

      id_evento: this.idEvento,

      id_cliente: this.cliente.id,

      id_forma_pago: Number(this.formaPagoSeleccionada),

      monto_Pagado: Number(this.montoPago),

      monto_Total: this.totalTransaccion,

      saldo_Pendiente:
        this.totalTransaccion - Number(this.montoPago),

      descripcion: '',

      fecha_Pago: new Date(),

      estado: 1,

      username: 'ADMIN',

      m_Username: null,

      id_Tipo_Movimiento:
        Number(this.tipoMovimientoSeleccionado),

      referencia: this.referencia,

      autorizacion: this.autorizacion,

      id_Banco:
        Number(this.bancoSeleccionado),

      id_Cuenta_Bancaria:
        Number(this.cuentaSeleccionada)

    };

    console.log('BODY PAGO:', body);

    this.pagosService
      .insertarPago(body)
      .subscribe({

        next: (response) => {

          console.log('Pago insertado', response);

          this.cargarPagos();

          this.limpiar();

        },

        error: (error) => {

          console.error('Error insertando pago', error);

        }

      });

  }
  eliminarPago(index: number) {

    this.pagos.splice(index, 1);

  }

  limpiar() {

    this.establecerValoresPorDefecto();
    this.montoPago = 0;
    this.referencia = '';
    this.autorizacion = '';
    this.bancoOrigen =
      this.bancos[0]?.descripcion ?? '';
    this.cuentaSeleccionada =
      this.cuentasEmpresa[0]?.id.toString() ?? '';

    this.cuentaDestino =
      this.cuentasEmpresa[0]?.numero_Cuenta ?? '';
  }

  get totalPagado(): number {

    return this.pagos.reduce(

      (acc, p) =>

        acc + Number(p.monto_Pagado),

      0

    );

  }

  get saldoPendiente(): number {

    return Math.max(
      this.totalTransaccion - this.totalPagado,
      0
    );

  }

  onCuentaChange(): void {

    this.cuentaDestino =
      this.cuentaActual?.numero_Cuenta ?? '';

  }

  get cambio(): number {

    return Math.max(
      this.totalPagado - this.totalTransaccion,
      0
    );

  }

}