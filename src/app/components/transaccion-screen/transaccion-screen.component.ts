import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/authService';
import { TransaccionesService } from '../../services/transacciones.service';
import { PagosService } from '../../services/pagosService';
import { MatDialog } from '@angular/material/dialog';
import { AlertGenericComponent } from '../alert-generic/alert-generic.component';
import { EventosService } from '../../services/eventosService';
import { DocumentLockService } from '../../services/document-lock.service';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { Console } from 'console';

@Component({
  selector: 'app-transaccion-screen',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaccion-screen.component.html',
  styleUrl: './transaccion-screen.component.css',
})

export class TransaccionScreenComponent implements OnChanges, OnDestroy {
  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private transaccionesService: TransaccionesService,
    private dialog: MatDialog,
    private eventosService: EventosService,
    private pagosService: PagosService,
    private documentLockService: DocumentLockService,
  ) {}
 
  private resetEventState(): void {
    this.eventoData = null;
    this.transacciones = [];
    this.productoBuscado = '';
    this.productoEncontrado = null;
    this.productosFiltrados = [];
    this.cantidad = 1;
    this.detalleProducto = '';
    this.viewDetailTransaccion = false;
    this.actualizarTotal();
  }

  // ==========================================================
  // DETECTAR CAMBIOS EN EVENTO
  // ==========================================================
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idEvento']) {
      if (this.idEvento) {
        this.resetEventState();
        this.cargarTransacciones();
        this.cargarEvento();
      } else {
        this.resetEventState();
      }
    }
  }

@Output() totalGeneralChange =
  new EventEmitter<number>();
  // input para recibir el id del evento o cliente, dependiendo del tipo de transacción que se esté realizando (compra o venta)
  @Input() idEvento: number | null = null;
  // input para recibir el id del cliente, dependiendo del tipo de transacción que se esté realizando (compra o venta)
  @Input() cliente: any = null;


  // Datos del evento cargados para el resumen
  eventoData: any = null;

  totalTransaccion = 0;

  productoBuscado = '';

  productoEncontrado: any = null;

  productosFiltrados: any[] = [];

  mostrarDropdown = false;

  cantidad = 1;

  detalleProducto = '';

  viewDetailTransaccion = false;

  transacciones: any[] = [];

  hasPayments: boolean = false;

  isLocked: boolean = false;

  private lockSub?: Subscription;

  loadingProductos = false;

  // Estado del desplegable de resumen de evento
  mostrarResumenEvento: boolean = false;

  toggleResumenEvento(): void {
    this.mostrarResumenEvento = !this.mostrarResumenEvento;
  }




   actualizarTotal(): void {

  console.log('EMITIENDO TOTAL:', this.totalGeneral);

  this.totalGeneralChange.emit(this.totalGeneral);

}
  // ==========================================================
  // FILTRAR PRODUCTOS DESDE API
  // ==========================================================
  filtrarProductos() {
    if (!this.productoBuscado.trim()) {
      this.productosFiltrados = [];

      this.mostrarDropdown = false;

      return;
    }

    this.loadingProductos = true;

    this.productosService.buscarProductos(this.productoBuscado).subscribe({
      next: (response) => {
        this.productosFiltrados = response.data.map((p: any) => ({
          id: p.id,

          sku: p.codigo,

          nombre: p.descripcion,

          descripcion: p.descripcion_Alterna,

          precio: p.precio_Venta,

          stock: p.cantidad,

          ultimoCosto: p.ultimo_Costo,
        }));

        this.mostrarDropdown = true;

        this.loadingProductos = false;
      },

      error: (error) => {
        console.error(error);

        this.loadingProductos = false;

        this.productosFiltrados = [];

        this.mostrarDropdown = false;
      },
    });
  }

  // ==========================================================
  // BUSCAR PRODUCTO EXACTO
  // ==========================================================
  buscarProducto() {
    if (!this.productoBuscado.trim()) {
      return;
    }

    this.productosService.buscarProductos(this.productoBuscado).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          const p = response.data[0];

          this.productoEncontrado = {
            id: p.id,

            sku: p.codigo,

            nombre: p.descripcion,

            descripcion: p.descripcion_Alterna,

            precio: p.precio_Venta,

            stock: p.cantidad,

            ultimoCosto: p.ultimo_Costo,
          };

          this.mostrarDropdown = false;
        }
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  // ==========================================================
  // SELECCIONAR PRODUCTO
  // ==========================================================
  seleccionarProducto(producto: any) {
    this.productoEncontrado = producto;

    this.productoBuscado = producto.nombre;

    this.mostrarDropdown = false;
  }


  // ==========================================================
  // CARGAR EVENTO (para resumen: tipo, fechas)
  // ==========================================================
  cargarEvento(): void {
    if (!this.idEvento) {
      return;
    }

    this.eventosService
      .obtenerEvento(this.idEvento)
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data) {
            this.eventoData = res.data;
            console.log('Evento cargado en Transaciones en Eventodata:', this.eventoData);
              // actualizar estado de pagos y bloqueo
              this.checkPaymentsAndLock();
          }
        },
        error: (err) => {
          console.error('Error al cargar evento en forma pago', err);
        }
      });
  }



  // ==========================================================
  // AGREGAR PRODUCTO
  // ==========================================================
  agregarProducto() {
    if (!this.productoEncontrado) {
      return;
    }

    if (!this.idEvento) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Evento requerido',
          mensaje:
            'Debes crear o cargar un evento antes de agregar transacciones.',
          tipo: 'warning',
          icon: 'warning',
        },
      });

      return;
    }
    if (!this.cliente) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Cliente requerido',
          mensaje: 'Debes seleccionar un cliente.',
          tipo: 'warning',
          icon: 'warning',
        },
      });

      return;
    }

    // Validar si el documento está bloqueado
    if (this.isLocked) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Documento bloqueado',
          mensaje:
            'El documento está bloqueado o ya tiene formas de pago aplicadas. Desbloquéalo para modificar transacciones.',
          tipo: 'warning',
          icon: 'warning',
        },
      });

      return;
    }

    // VALIDAR CANTIDAD
    if (this.cantidad <= 0) {
      return;
    }

    const subtotal = this.productoEncontrado.precio * this.cantidad;

    // ==========================================================
    // BODY API
    // ==========================================================
    const body = {
      id_cliente: this.cliente.id,

      id_evento: this.idEvento,

      id_producto: this.productoEncontrado.id,

      tipo_Transaccion: 1,

      monto: subtotal,

      descripcion:
        this.productoEncontrado.nombre?.trim() || this.productoEncontrado.nombre,

      username: this.authService.getUsername(),

      observacion_01: this.detalleProducto,

      observacion_02: `Cantidad: ${this.cantidad}`,

      cantidad: this.cantidad,
    };

    console.log('BODY TRANSACCION:', body);

    // ==========================================================
    // INSERTAR EN API
    // ==========================================================
    this.transaccionesService.insertTransaccion(body).subscribe({
      next: (res) => {
        if (res?.success) {
          // ==========================================
          // VALIDAR SI YA EXISTE EN GRID
          // ==========================================
          const existe = this.transacciones.find(
            (x) => x.id === this.productoEncontrado.id,
          );

          if (existe) {
            existe.cantidad += this.cantidad;

            existe.subtotal = existe.cantidad * existe.precio;
          } else {
            this.transacciones.push({
              
              ...this.productoEncontrado,

              cantidad: this.cantidad,

              detalle: this.detalleProducto,

              subtotal,

              
            });
          }

          this.actualizarTotal();

          // RESET
          this.cantidad = 1;

          this.detalleProducto = '';

          this.productoBuscado = '';

          this.productoEncontrado = null;

          this.viewDetailTransaccion = false;

          this.productosFiltrados = [];

          // ALERTA
          this.dialog.open(AlertGenericComponent, {
            width: '450px',
            data: {
              titulo: 'Transacción agregada',
              mensaje: 'El producto fue agregado correctamente.',
              tipo: 'success',
              icon: 'check_circle',
              detalles: [
                {
                  etiqueta: 'Producto',
                  valor: body.observacion_01,
                },
                {
                  etiqueta: 'Monto',
                  valor: body.monto,
                },
              ],
            },
          });
        }
      },

      error: (err) => {
        console.error(err);

        this.dialog.open(AlertGenericComponent, {
          width: '450px',
          data: {
            titulo: 'Error',
            mensaje: err?.error?.mensaje || 'Error al guardar transacción',
            tipo: 'error',
            icon: 'error',
          },
        });
      },
    });
  }



// ==========================================================
// CARGAR TRANSACCIONES DEL EVENTO
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

              this.transacciones = res.data
            .map((t: any) => {
              const cantidad = Number(t.cantidad) || 1;
              const monto = Number(t.monto) || 0;

              return {
                id: t.id || t.id_producto || null,
                descripcion: t.descripcion || t.nombre || 'Descripción no disponible',
                observacion: t.observacion_01 || '',
                cantidad,
                precio: cantidad ? monto / cantidad : monto,
                subtotal: monto,
              };
            })
            .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0));

          console.log(
            'TRANSACCIONES CARGADAS:',
            this.transacciones
          );

          this.actualizarTotal();
            // actualizar estado de pagos y bloqueo
            this.checkPaymentsAndLock();
        }
      },

      error: (err) => {

        console.error(
          'Error al cargar transacciones',
          err
        );
      }
    });
}

  

  // ==========================================================
  // ELIMINAR PRODUCTO
  // ==========================================================
  eliminarProducto(index: number) {

    if (this.isLocked) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Documento bloqueado',
          mensaje:
            'No se puede eliminar una transacción porque el documento está bloqueado o ya tiene pagos aplicados.',
          tipo: 'warning',
          icon: 'warning',
        },
      });

      return;
    }

    const transaccion = this.transacciones[index];
    
    if (!transaccion) {
      return;
    }

    // Si la transacción tiene un ID (fue guardada en la BD), eliminarla del servidor
    if (transaccion.id) {
      this.transaccionesService.eliminarTransaccion(transaccion.id).subscribe({
        next: (res) => {
          if (res?.success) {
            this.transacciones.splice(index, 1);
            this.actualizarTotal();

            this.dialog.open(AlertGenericComponent, {
              width: '450px',
              data: {
                titulo: 'Transacción eliminada',
                mensaje: 'La transacción fue eliminada correctamente.',
                tipo: 'success',
                icon: 'check_circle',
              },
            });
          }
        },
        error: (err) => {
          console.error('Error eliminando transacción:', err);
          this.dialog.open(AlertGenericComponent, {
            width: '450px',
            data: {
              titulo: 'Error',
              mensaje: err?.error?.mensaje || 'Error al eliminar la transacción',
              tipo: 'error',
              icon: 'error',
            },
          });
        },
      });
    } else {
      // Si no tiene ID, solo eliminar localmente
      this.transacciones.splice(index, 1);
      this.actualizarTotal();
    }

}

  // Comprueba si el evento tiene pagos y si está bloqueado
  private checkPaymentsAndLock(): void {
    if (!this.idEvento) {
      this.hasPayments = false;
      this.isLocked = false;
      return;
    }

    this.pagosService.obtenerPagos(this.idEvento).subscribe({
      next: (res) => {
        this.hasPayments = (res?.data?.length ?? 0) > 0;
      },
      error: (err) => {
        console.error('Error comprobando pagos del evento', err);
        this.hasPayments = false;
      },
    });

    // subscribe to lock state
    this.lockSub?.unsubscribe();
    this.lockSub = this.documentLockService
      .isLocked$(this.idEvento)
      .subscribe((v) => (this.isLocked = v));
  }

  ngOnDestroy(): void {
    this.lockSub?.unsubscribe();
  }

  unlockDocument(): void {
    if (!this.idEvento) return;

    const dialogRef = this.dialog.open(AlertGenericComponent, {
      width: '450px',
      data: {
        titulo: 'Desbloquear documento',
        mensaje: '¿Desea desbloquear el documento para permitir cambios en transacciones?',
        tipo: 'warning',
        icon: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== false) {
        this.documentLockService.unlock(this.idEvento!);
      }
    });
  }

  // ==========================================================
  // AUMENTAR
  // ==========================================================
  aumentarCantidad() {
    this.cantidad++;
  }

  // ==========================================================
  // DISMINUIR
  // ==========================================================
  disminuirCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  // ==========================================================
  // TOTAL GENERAL
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
