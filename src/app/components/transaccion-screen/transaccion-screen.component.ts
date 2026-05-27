import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/authService';
import { TransaccionesService } from '../../services/transacciones.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertGenericComponent } from '../alert-generic/alert-generic.component';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-transaccion-screen',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaccion-screen.component.html',
  styleUrl: './transaccion-screen.component.css',
})

export class TransaccionScreenComponent implements OnChanges {
  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private transaccionesService: TransaccionesService,
    private dialog: MatDialog,
  ) {}
 
  
  // ==========================================================
// DETECTAR CAMBIOS EN EVENTO
// ==========================================================
ngOnChanges(changes: SimpleChanges): void {

  if (changes['idEvento']) {

    if (this.idEvento) {

      this.cargarTransacciones();
    }
  }
}

  // input para recibir el id del evento o cliente, dependiendo del tipo de transacción que se esté realizando (compra o venta)
  @Input() idEvento: number | null = null;
  // input para recibir el id del cliente, dependiendo del tipo de transacción que se esté realizando (compra o venta)
  @Input() cliente: any = null;

  productoBuscado = '';

  productoEncontrado: any = null;

  productosFiltrados: any[] = [];

  mostrarDropdown = false;

  cantidad = 1;

  detalleProducto = '';

  viewDetailTransaccion = false;

  transacciones: any[] = [];

  loadingProductos = false;

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

          this.transacciones = res.data.map((t: any) => ({

            id: t.id_producto,

            cantidad: Number(t.cantidad),

            subtotal: Number(t.monto),

            detalle: t.descripcion,

            precio:
              Number(t.monto) / Number(t.cantidad),

            nombre: t.observacion_01,

            descripcion: t.descripcion
          }));

          console.log(
            'TRANSACCIONES CARGADAS:',
            this.transacciones
          );
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
    this.transacciones.splice(index, 1);
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
