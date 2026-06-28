import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormaPagoModel } from '../../models/formaPagoModel';
import { FormaPagoService } from '../../services/formaPagoService';
import { TipoMovimientoModel } from '../../models/tipoMovimientoModel';
import { TipoMovimientoService } from '../../services/tipoMovimientoService';

@Component({
  selector: 'app-forma-pago-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './forma-pago-screen.component.html',
  styleUrl: './forma-pago-screen.component.css'
})
export class FormaPagoScreenComponent implements OnInit {

  @Input() idEvento: number | null = null;

  @Input() cliente: any = null;

  @Input() totalTransaccion = 0;

  formaPagoSeleccionada = '';

  montoPago = 0;

  referencia = '';

  autorizacion = '';

  bancoOrigen = '';

  cuentaDestino = '';

  pagos: any[] = [];

  formasPago: FormaPagoModel[] = [];

  tiposMovimiento: TipoMovimientoModel[] = [];

  tipoMovimientoSeleccionado = '';

  bancos: any[] = [];

  cuentasEmpresa: any[] = [];

  constructor(
    private formaPagoService: FormaPagoService,
    private tipoMovimientoService: TipoMovimientoService
  ) { }

  ngOnInit(): void {

    this.cargarFormasPago();
    this.cargarTiposMovimiento();

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

  agregarPago() {

    if (!this.formaPagoSeleccionada) {
      return;
    }

    this.pagos.push({

      idTipoMovimiento:
        Number(this.tipoMovimientoSeleccionado),

      tipoMovimiento:
        this.tiposMovimiento.find(
          x => x.id === Number(this.tipoMovimientoSeleccionado)
        )?.descripcion,

      idFormaPago:
        Number(this.formaPagoSeleccionada),

      formaPago:
        this.formaPagoActual?.descripcion,

      monto:
        Number(this.montoPago),

      referencia:
        this.referencia,

      autorizacion:
        this.autorizacion,

      bancoOrigen:
        this.bancoOrigen,

      cuentaDestino:
        this.cuentaDestino

    });

    this.limpiar();

  }

  eliminarPago(index: number) {

    this.pagos.splice(index, 1);

  }

  limpiar() {

    this.formaPagoSeleccionada = '';

    this.montoPago = 0;

    this.referencia = '';

    this.autorizacion = '';

    this.bancoOrigen = '';

    this.cuentaDestino = '';

  }

  get totalPagado(): number {

    return this.pagos.reduce(
      (acc, p) => acc + Number(p.monto),
      0
    );

  }

  get saldoPendiente(): number {

    return Math.max(
      this.totalTransaccion - this.totalPagado,
      0
    );

  }

  get cambio(): number {

    return Math.max(
      this.totalPagado - this.totalTransaccion,
      0
    );

  }

}