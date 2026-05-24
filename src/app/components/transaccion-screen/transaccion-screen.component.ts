import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-transaccion-screen',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaccion-screen.component.html',
  styleUrl: './transaccion-screen.component.css'
})
export class TransaccionScreenComponent {

  constructor(
    private productosService: ProductosService
  ) { }

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

    this.productosService
      .buscarProductos(this.productoBuscado)
      .subscribe({

        next: (response) => {

          this.productosFiltrados =
            response.data.map((p: any) => ({

              id: p.id,

              sku: p.codigo,

              nombre: p.descripcion,

              descripcion: p.descripcion_Alterna,

              precio: p.precio_Venta,

              stock: p.cantidad,

              ultimoCosto: p.ultimo_Costo
            }));

          this.mostrarDropdown = true;

          this.loadingProductos = false;
        },

        error: (error) => {

          console.error(error);

          this.loadingProductos = false;

          this.productosFiltrados = [];

          this.mostrarDropdown = false;
        }
      });
  }

  // ==========================================================
  // BUSCAR PRODUCTO EXACTO
  // ==========================================================
  buscarProducto() {

    if (!this.productoBuscado.trim()) {
      return;
    }

    this.productosService
      .buscarProductos(this.productoBuscado)
      .subscribe({

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

              ultimoCosto: p.ultimo_Costo
            };

            this.mostrarDropdown = false;
          }
        },

        error: (error) => {

          console.error(error);
        }
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

    // VALIDAR CANTIDAD
    if (this.cantidad <= 0) {
      return;
    }

    const subtotal =
      this.productoEncontrado.precio * this.cantidad;

    // VALIDAR SI YA EXISTE
    const existe =
      this.transacciones.find(
        x => x.id === this.productoEncontrado.id
      );

    if (existe) {

      existe.cantidad += this.cantidad;

      existe.subtotal =
        existe.cantidad * existe.precio;

      return;
    }

    this.transacciones.push({

      ...this.productoEncontrado,

      cantidad: this.cantidad,

      detalle: this.detalleProducto,

      subtotal
    });

    // RESET
    this.cantidad = 1;

    this.detalleProducto = '';

    this.productoBuscado = '';

    this.productoEncontrado = null;

    this.viewDetailTransaccion = false;

    this.productosFiltrados = [];
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
      (acc, item) => acc + item.subtotal,
      0
    );
  }

  // ==========================================================
  // TOTAL UNIDADES
  // ==========================================================
  get totalUnidades(): number {

    return this.transacciones.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );
  }
}