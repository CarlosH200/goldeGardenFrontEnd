import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormaPagoModel } from '../../models/formaPagoModel';
import { FormaPagoService } from '../../services/formaPagoService';

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

  bancos: any[] = [];

  cuentasEmpresa: any[] = [];

  constructor(
    private formaPagoService: FormaPagoService
  ) { }

  ngOnInit(): void {

    this.cargarFormasPago();

  }

  cargarFormasPago(): void {

    this.formaPagoService
      .getFormasPago()
      .subscribe({

        next: (response) => {

          this.formasPago = response;

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

      idFormaPago: Number(this.formaPagoSeleccionada),

      formaPago: this.formaPagoActual?.descripcion,

      monto: Number(this.montoPago),

      referencia: this.referencia,

      autorizacion: this.autorizacion,

      bancoOrigen: this.bancoOrigen,

      cuentaDestino: this.cuentaDestino

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