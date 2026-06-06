import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forma-pago-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './forma-pago-screen.component.html',
  styleUrl: './forma-pago-screen.component.css'
})
export class FormaPagoScreenComponent {

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

  formasPago = [
    { id: 'EFE', descripcion: 'Efectivo' },
    { id: 'TAR', descripcion: 'Tarjeta' },
    { id: 'TRA', descripcion: 'Transferencia' },
    { id: 'CHE', descripcion: 'Cheque' }
  ];

  bancos: any[] = [];

  cuentasEmpresa: any[] = [];

  get esTransferencia() {
    return this.formaPagoSeleccionada === 'TRA';
  }

  get esTarjeta() {
    return this.formaPagoSeleccionada === 'TAR';
  }

  agregarPago() {

    this.pagos.push({

      formaPago: this.formasPago.find(
        x => x.id === this.formaPagoSeleccionada
      )?.descripcion,

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
