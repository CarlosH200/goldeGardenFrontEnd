import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
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
import { TransaccionesService } from '../../services/transacciones.service';
import { EventosService } from '../../services/eventosService';
import { DocumentLockService } from '../../services/document-lock.service';

@Component({
  selector: 'app-forma-pago-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './forma-pago-screen.component.html',
  styleUrl: './forma-pago-screen.component.css',
})
export class FormaPagoScreenComponent implements OnInit, OnChanges {
  @Input() idEvento: number | null = null;

  @Input() cliente: any = null;

  @Input() totalTransaccion = 0;

  // Estado del desplegable de resumen de evento
  mostrarResumenEvento: boolean = false;

  formaPagoSeleccionada = '';

  montoPago = 0;

  referencia = '';

  autorizacion = '';

  bancoOrigen = '';

  cuentaDestino = '';

  pagos: PagoModel[] = [];

  // Transacciones cargadas para el resumen de evento
  transacciones: any[] = [];

  // Datos del evento cargados para el resumen
  eventoData: any = null;

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
    private transaccionesService: TransaccionesService,
    private eventosService: EventosService,
    private documentLockService: DocumentLockService,
  ) {}

  private resetEventState(): void {
    this.eventoData = null;
    this.transacciones = [];
    this.pagos = [];
    this.montoPago = 0;
    this.referencia = '';
    this.autorizacion = '';
    this.tipoMovimientoSeleccionado = '';
    this.formaPagoSeleccionada = this.formasPago[0]?.id?.toString() ?? '';
    this.bancoSeleccionado = this.bancos[0]?.id?.toString() ?? '';
    this.cuentaSeleccionada = this.cuentasEmpresa[0]?.id?.toString() ?? '';
    this.bancoOrigen = this.bancos[0]?.descripcion ?? '';
    this.cuentaDestino = this.cuentasEmpresa[0]?.numero_Cuenta ?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idEvento']) {
      if (this.idEvento) {
        this.resetEventState();
        this.cargarPagos();
        this.cargarTransacciones();
        this.cargarEvento();
      } else {
        this.resetEventState();
      }
    }

    if (changes['cliente']) {
      console.log('CLIENTE RECIBIDO EN FORMA PAGO:', this.cliente);
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

    this.pagosService.obtenerPagos(this.idEvento).subscribe({
      next: (response) => {
        this.pagos = response.data;
      },

      error: (error) => {
        console.error('Error cargando pagos', error);
      },
    });
  }

  private establecerValoresPorDefecto(): void {
    this.formaPagoSeleccionada = (this.formasPago[0]?.id ?? '').toString();

    const anticipo = this.tiposMovimiento.find(
      (x) => x.descripcion === 'ANTICIPO',
    );

    this.tipoMovimientoSeleccionado = (
      anticipo?.id ??
      this.tiposMovimiento[0]?.id ??
      ''
    ).toString();

    this.bancoSeleccionado = (this.bancos[0]?.id ?? '').toString();

    this.cuentaSeleccionada = (this.cuentasEmpresa[0]?.id ?? '').toString();
  }

  cargarCuentasBancarias(idBanco: number): void {
    this.cuentaBancariaService.getCuentasBancarias(idBanco).subscribe({
      next: (response) => {
        this.cuentasEmpresa = response;

        if (this.cuentasEmpresa.length > 0) {
          this.cuentaSeleccionada = this.cuentasEmpresa[0].id.toString();
        } else {
          this.cuentaSeleccionada = '';
        }
      },

      error: (error) => {
        console.error('Error cargando cuentas bancarias', error);
      },
    });
  }

  cargarBancos(): void {
    this.bancoService.getBancos().subscribe({
      next: (response) => {
        this.bancos = response;

        if (this.bancos.length > 0) {
          this.bancoSeleccionado = this.bancos[0].id.toString();

          this.bancoOrigen = this.bancos[0].descripcion;

          this.cargarCuentasBancarias(this.bancos[0].id);
        }
      },

      error: (error) => {
        console.error('Error cargando bancos', error);
      },
    });
  }

  onBancoChange(): void {
    const banco = this.bancos.find(
      (x) => x.id === Number(this.bancoSeleccionado),
    );

    this.bancoOrigen = banco?.descripcion ?? '';

    this.cargarCuentasBancarias(Number(this.bancoSeleccionado));
  }

  get bancoActual(): BancoModel | undefined {
    return this.bancos.find((x) => x.id === Number(this.bancoSeleccionado));
  }

  get cuentaActual(): CuentaBancariaModel | undefined {
    return this.cuentasEmpresa.find(
      (x) => x.id === Number(this.cuentaSeleccionada),
    );
  }

  toggleResumenEvento(): void {
    this.mostrarResumenEvento = !this.mostrarResumenEvento;
  }

  cargarTiposMovimiento(): void {
    this.tipoMovimientoService.getTiposMovimiento().subscribe({
      next: (response) => {
        this.tiposMovimiento = response;

        // DEFAULT: ANTICIPO (recomendado negocio)
        const anticipo = this.tiposMovimiento.find(
          (x) => x.descripcion === 'ANTICIPO',
        );

        this.tipoMovimientoSeleccionado = (
          anticipo?.id ??
          this.tiposMovimiento[0]?.id ??
          ''
        ).toString();
      },

      error: (error) => {
        console.error('Error cargando tipos de movimiento', error);
      },
    });
  }

  cargarFormasPago(): void {
    this.formaPagoService.getFormasPago().subscribe({
      next: (response) => {
        this.formasPago = response;

        // DEFAULT: primera forma activa
        this.formaPagoSeleccionada = (this.formasPago[0]?.id ?? '').toString();
      },

      error: (error) => {
        console.error('Error cargando formas de pago', error);
      },
    });
  }

  get formaPagoActual(): FormaPagoModel | undefined {
    return this.formasPago.find(
      (x) => x.id === Number(this.formaPagoSeleccionada),
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

    // Validaciones: no permitir agregar si ya no hay saldo pendiente
    if (this.saldoPendiente <= 0) {
      console.error('No hay saldo pendiente. No se pueden agregar más formas de pago.');
      return;
    }

    if (Number(this.montoPago) <= 0) {
      console.error('El monto a pagar debe ser mayor a 0.');
      return;
    }

    const nuevoSaldoPendiente = Math.max(
      this.totalTransaccion - (this.totalPagado + Number(this.montoPago)),
      0,
    );

    const body = {
      id_evento: this.idEvento,

      id_cliente: this.cliente.id,

      id_forma_pago: Number(this.formaPagoSeleccionada),

      monto_Pagado: Number(this.montoPago),

      monto_Total: this.totalTransaccion,

      // Calcula el saldo pendiente considerando los pagos ya agregados
      saldo_Pendiente: nuevoSaldoPendiente,

      descripcion: '',

      fecha_Pago: new Date(),

      estado: 1,

      username: 'ADMIN',

      m_Username: null,

      id_Tipo_Movimiento: Number(this.tipoMovimientoSeleccionado),

      referencia: this.referencia,

      autorizacion: this.autorizacion,

      id_Banco: Number(this.bancoSeleccionado),

      id_Cuenta_Bancaria: Number(this.cuentaSeleccionada),
    };

    console.log('BODY PAGO:', body);

    this.pagosService.insertarPago(body).subscribe({
      next: (response) => {
        console.log('Pago insertado', response);

        // Si el backend devolvió un id, hacemos un agregado optimista local
        const pagoLocal: PagoModel = {
          id: response?.id ?? 0,
          id_evento: this.idEvento ?? 0,
          id_cliente: this.cliente.id,
          id_forma_pago: Number(this.formaPagoSeleccionada),
          monto_Pagado: Number(this.montoPago),
          monto_Total: this.totalTransaccion,
          saldo_Pendiente: nuevoSaldoPendiente,
          descripcion: this.formaPagoActual?.descripcion ?? '',
          fecha_Pago: new Date().toISOString(),
          estado: 1,
          username: 'ADMIN',
          m_Username: null,
          fecha_Hora: new Date().toISOString(),
          m_Fecha_Hora: null,
          consecutivo_Interno: 0,
          id_Tipo_Movimiento: Number(this.tipoMovimientoSeleccionado),
          referencia: this.referencia,
          autorizacion: this.autorizacion,
          id_Banco: Number(this.bancoSeleccionado),
          id_Cuenta_Bancaria: Number(this.cuentaSeleccionada),
          forma_Pago: this.formaPagoActual?.descripcion ?? '',
          tipo_Movimiento:
            this.tiposMovimiento.find((t) => t.id === Number(this.tipoMovimientoSeleccionado))?.descripcion ?? '',
          banco: this.bancoOrigen ?? '',
          cuenta_Bancaria: this.cuentaDestino ?? '',
          estado_Descripcion: 'Registrado',
        };

        this.pagos.push(pagoLocal);

        // Bloquear documento en cuanto haya al menos un pago
        if (this.idEvento) {
          this.documentLockService.lock(this.idEvento);
        }

        // Limpiar campos de entrada
        this.limpiar();
      },

      error: (error) => {
        console.error('Error insertando pago', error);
      },
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
    this.eventoData = null;
    this.bancoOrigen = this.bancos[0]?.descripcion ?? '';
    this.cuentaSeleccionada = this.cuentasEmpresa[0]?.id.toString() ?? '';

    this.cuentaDestino = this.cuentasEmpresa[0]?.numero_Cuenta ?? '';
  }

  get totalPagado(): number {
    return this.pagos.reduce(
      (acc, p) => acc + Number(p.monto_Pagado),

      0,
    );
  }

  get saldoPendiente(): number {
    return Math.max(this.totalTransaccion - this.totalPagado, 0);
  }

  onCuentaChange(): void {
    this.cuentaDestino = this.cuentaActual?.numero_Cuenta ?? '';
  }

  get cambio(): number {
    return Math.max(this.totalPagado - this.totalTransaccion, 0);
  }

  // ==========================================================
  // CARGAR TRANSACCIONES DEL EVENTO (para resumen)
  // ==========================================================
  cargarTransacciones(): void {
    if (!this.idEvento) {
      return;
    }

    this.transaccionesService
      .buscarTransaccionesEvento(this.idEvento)
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.transacciones = res.data.map((t: any) => ({
              id: t.id_producto,
              cantidad: Number(t.cantidad),
              subtotal: Number(t.monto),
              detalle: t.descripcion,
              precio: Number(t.monto) / Number(t.cantidad),
              nombre: t.observacion_01,
              nombre_Producto: t.observacion_01,
              descripcion: t.descripcion,
              precio_Unitario: Number(t.monto) / Number(t.cantidad),
            }));
          }
        },
        error: (err) => {
          console.error('Error al cargar transacciones en forma pago', err);
        },
      });
  }

  // ==========================================================
  // CARGAR EVENTO (para resumen: tipo, fechas)
  // ==========================================================
  cargarEvento(): void {
    if (!this.idEvento) {
      return;
    }

    this.eventosService.obtenerEvento(this.idEvento).subscribe({
      next: (res) => {
        if (res?.success && res?.data) {
          this.eventoData = res.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar evento en forma pago', err);
      },
    });
  }

  // ==========================================================
  // TOTAL GENERAL (suma de transacciones)
  // ==========================================================
  get totalGeneral(): number {
    return this.transacciones.reduce(
      (acc, item) => acc + Number(item.subtotal),
      0,
    );
  }

  // ==========================================================
  // TOTAL UNIDADES
  // ==========================================================
  get totalUnidades(): number {
    return this.transacciones.reduce(
      (acc, item) => acc + Number(item.cantidad),
      0,
    );
  }
}
