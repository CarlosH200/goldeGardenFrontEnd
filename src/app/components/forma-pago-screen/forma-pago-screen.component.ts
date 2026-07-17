import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormaPagoModel } from '../../models/formaPagoModel';
import { FormaPagoService } from '../../services/formaPagoService';
import { TipoMovimientoModel } from '../../models/tipoMovimientoModel';
import { TipoMovimientoService } from '../../services/tipoMovimientoService';
import { BancoModel } from '../../models/bancoModel';
import { BancoService } from '../../services/bancoService';
import { CuentaBancariaModel } from '../../models/cuentaBancariaModel';
import { CuentaBancariaService } from '../../services/cuentaBancariaService';

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

  cuentasEmpresa: CuentaBancariaModel[] = [];

  cuentaSeleccionada = '';

  bancos: BancoModel[] = [];

  bancoSeleccionado = '';


  constructor(
    private formaPagoService: FormaPagoService,
    private tipoMovimientoService: TipoMovimientoService,
    private bancoService: BancoService,
    private cuentaBancariaService: CuentaBancariaService,
  ) { }

  ngOnInit(): void {

    this.cargarFormasPago();
    this.cargarTiposMovimiento();
    this.cargarBancos();
    // cuenta bancaria no va porque lleva parametro el id banco
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

agregarPago() {

  if (!this.formaPagoSeleccionada) {
    return;
  }

  this.pagos.push({

    idBanco:
      Number(this.bancoSeleccionado),

    banco:
      this.bancoActual?.descripcion,

    idCuentaBancaria:
      Number(this.cuentaSeleccionada),

    cuentaDestino:
      this.cuentaActual?.numero_Cuenta,

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
      this.bancoOrigen

  });

  this.limpiar();

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