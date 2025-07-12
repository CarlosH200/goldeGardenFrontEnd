import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-transaccion-screen',
  imports: [FormsModule,CommonModule],
  templateUrl: './transaccion-screen.component.html',
  styleUrl: './transaccion-screen.component.css'
})
export class TransaccionScreenComponent {
productoBuscado = '';
productoEncontrado: any = null;
viewDetailTransaccion = false;

buscarProducto() {
  // Simula búsqueda
  this.productoEncontrado = {
    nombre: this.productoBuscado,
    descripcion: 'Descripción del producto de ejemplo.',
    precio: 150.00
  };
}

agregarProducto() {
  alert(`Producto ${this.productoEncontrado?.nombre || ''} agregado`);
}

// Funcion para mostrar u ocultar el detalle de la transacción
verDetalleTransaccion() {
  if (this.viewDetailTransaccion == false) {
  this.viewDetailTransaccion = true;
  }else {

  this.viewDetailTransaccion = false;
}
}
}