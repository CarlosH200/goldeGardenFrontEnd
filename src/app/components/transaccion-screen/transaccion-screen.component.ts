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
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-transaccion-screen',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaccion-screen.component.html',
  styleUrl: './transaccion-screen.component.css',
})

export class TransaccionScreenComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private transaccionesService: TransaccionesService,
    private dialog: MatDialog,
    private eventosService: EventosService,
    private pagosService: PagosService,
    private documentLockService: DocumentLockService,
    private cdr: ChangeDetectorRef,   //inyecta ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.idEvento) {
      this.cargarTransacciones();
      this.cargarEvento();
    }
  }

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

    // console.log('EMITIENDO TOTAL:', this.totalGeneral);

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

          observacionProducto: p.observacion_1 || '',
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

            observacionProducto: p.observacion_1 || '',
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
            const bloqueadoBD = res.data.bloqueado === true;
            this.isLocked = bloqueadoBD;
            this.documentLockService.setLocked(this.idEvento!, bloqueadoBD);
            this.checkPaymentsAndLock();
          }
        },
        error: (err) => {
          console.error('Error al cargar evento en transacciones', err);
        }
      });
  }



  // ==========================================================
  // AGREGAR PRODUCTO
  // ==========================================================
  agregarProducto() {
    if (!this.productoEncontrado) {
      this.dialog.open(AlertGenericComponent, {
        width: '450px',
        data: {
          titulo: 'Producto requerido',
          mensaje: 'Debes buscar y seleccionar un producto antes de agregar la transacción.',
          tipo: 'warning',
          icon: 'warning',
        },
      });
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

      // Guarda los bullets del producto para mostrarlos en la vista y formatos PDF
      observacion_02: this.productoEncontrado.observacionProducto || '',

      cantidad: this.cantidad,
    };

    // // console.log('BODY TRANSACCION:', body);

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

              observacion: this.detalleProducto,

              observacionProducto: this.productoEncontrado.observacionProducto || '',

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
                  valor: body.descripcion,
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
            console.log('TRANSACCIONES RAW RES.DATA:', res.data);

            const rawItems = res.data;

            // Consultar catálogo de productos para cruzar observacion_1 garantizado
            this.productosService.buscarProductos('').subscribe({
              next: (prodRes) => {
                const mapProductos = new Map<number, any>();
                const mapPorNombre = new Map<string, any>();

                if (prodRes?.success && Array.isArray(prodRes.data)) {
                  prodRes.data.forEach((p: any) => {
                    mapProductos.set(p.id, p);
                    if (p.descripcion) {
                      mapPorNombre.set(p.descripcion.trim().toUpperCase(), p);
                    }
                  });
                }

                console.log('%c======================================================', 'color: yellow; font-size: 16px; font-weight: bold;');
                console.log('%c🔍 DIAGNÓSTICO DE PRODUCTOS Y VIÑETAS', 'color: #00ff00; font-size: 18px; font-weight: bold;');
                console.log('📦 Total productos en catálogo:', prodRes?.data?.length);
                console.log('📦 Total transacciones en evento:', rawItems?.length);

                this.transacciones = rawItems
                  .map((t: any) => {
                    const cantidad = Number(t.cantidad) || 1;
                    const monto = Number(t.monto) || 0;
                    const idProd = Number(t.id_producto);
                    const prodMatch =
                      mapProductos.get(idProd) ||
                      mapPorNombre.get((t.descripcion || t.nombre || '').trim().toUpperCase());

                    // Buscar en prodMatch cualquier propiedad de observación (insensible a mayúsculas/minúsculas o nombres alternos)
                    let obsFromProd = '';
                    if (prodMatch) {
                      for (const key of Object.keys(prodMatch)) {
                        if (key.toLowerCase().includes('observacion') && prodMatch[key]) {
                          obsFromProd = prodMatch[key];
                          break;
                        }
                      }
                    }

                    const obsProd =
                      obsFromProd ||
                      prodMatch?.observacion_1 ||
                      prodMatch?.Observacion_1 ||
                      prodMatch?.observacion1 ||
                      t.observacion_1 ||
                      '';

                    console.log('   Objeto completo en catálogo prodMatch:', prodMatch);
                    if (idProd === 10) {
                      console.log('%c🔍 DISCOTECA MOVIL KEYS:', 'color: orange; font-weight: bold;', Object.keys(prodMatch || {}));
                      console.log('%c🔍 DISCOTECA MOVIL JSON:', 'color: orange;', JSON.stringify(prodMatch));
                    }

                    console.log(`%c👉 Producto: [${t.descripcion}] | ID_Producto: ${idProd}`, 'color: cyan; font-weight: bold;');
                    console.log('   Encontrado en Catálogo?:', prodMatch ? 'SÍ' : 'NO');
                    console.log('   Observación 1 obtenida:', obsProd ? obsProd : '(VACÍA / NULL)');

                    return {
                      id: t.id || t.id_producto || null,
                      id_producto: t.id_producto,
                      descripcion: t.descripcion || t.nombre || prodMatch?.descripcion || 'Descripción no disponible',
                      observacion: t.observacion_01 || '',
                      observacionProducto: obsProd,
                      cantidad,
                      precio: cantidad ? monto / cantidad : monto,
                      subtotal: monto,
                    };
                  })
                  .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0));

                console.log('%c======================================================', 'color: yellow; font-size: 16px; font-weight: bold;');

                this.actualizarTotal();
                this.checkPaymentsAndLock();
                this.cdr.detectChanges();
              },
              error: () => {
                this.transacciones = rawItems
                  .map((t: any) => {
                    const cantidad = Number(t.cantidad) || 1;
                    const monto = Number(t.monto) || 0;
                    return {
                      id: t.id || t.id_producto || null,
                      id_producto: t.id_producto,
                      descripcion: t.descripcion || t.nombre || 'Descripción no disponible',
                      observacion: t.observacion_01 || '',
                      observacionProducto: t.observacion_1 || t.observacion_02 || '',
                      cantidad,
                      precio: cantidad ? monto / cantidad : monto,
                      subtotal: monto,
                    };
                  })
                  .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0));

                this.actualizarTotal();
                this.checkPaymentsAndLock();
                this.cdr.detectChanges();
              }
            });
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
  const transaccion = this.transacciones[index];
  if (!transaccion) return;

  // 🚫 Validación: documento bloqueado
  if (this.isLocked) {
    this.dialog.open(AlertGenericComponent, {
      width: '450px',
      data: {
        titulo: 'Documento bloqueado',
        mensaje: 'Debes desbloquear el documento para poder eliminar una transacción.',
        tipo: 'warning',
        icon: 'lock',
      },
    });
    return;
  }

  // 👇 Abrimos el diálogo con botones Cancelar/Aceptar
  const dialogRef = this.dialog.open(AlertGenericComponent, {
    width: '450px',
    data: {
      titulo: 'Confirmar eliminación',
      mensaje: '¿Estás seguro de eliminar esta transacción?',
      tipo: 'warning',
      icon: 'warning',
      mostrarBotones: true
    },
  });

  dialogRef.afterClosed().subscribe((resultado) => {
    if (resultado !== 'confirmar' && resultado !== true) {
      return;
    }

    if (transaccion.id) {
      this.transaccionesService.eliminarTransaccion(
        transaccion.id,
        this.authService.getUsername()
      ).subscribe({
        next: (res) => {
          if (res?.success) {
            this.transacciones.splice(index, 1);
            setTimeout(() => {
              this.actualizarTotal();
              this.cdr.detectChanges();
            });
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
      this.transacciones.splice(index, 1);
      setTimeout(() => {
        this.actualizarTotal();
        this.cdr.detectChanges();
      });
    }
  });
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

  // ==========================================================
  // PARSEAR BULLETS  (* cosa 1 * cosa 2  →  ['• cosa 1', '• cosa 2'])
  // ==========================================================
  parsearBullets(texto: string | undefined | null): string[] {
    if (!texto || !texto.trim()) return [];
    // Si viene del formato anterior "Cantidad: X", ignorarlo
    if (/^cantidad:\s*\d+/i.test(texto.trim())) return [];
    
    // Si contiene '*', dividir por '*'
    if (texto.includes('*')) {
      return texto
        .split('*')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => `• ${s}`);
    }

    return [`• ${texto.trim()}`];
  }
}
