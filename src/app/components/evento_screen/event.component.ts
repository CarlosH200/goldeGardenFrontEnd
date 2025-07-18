import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionScreenComponent } from '../transaccion-screen/transaccion-screen.component';
import { DocumentoScreenComponent } from "../documento-screen/documento-screen.component";

@Component({
  selector: 'app-event',
  imports: [CommonModule, FormsModule, TransaccionScreenComponent, DocumentoScreenComponent],
  templateUrl: './event.component.html',
  styleUrl: './evento.component.css',
})
export class EventComponent {

  // Variable para cambiar la pestaña seleccionada entre documento, transacciones y pago
  selectedTab: string = 'documento';

  
}
