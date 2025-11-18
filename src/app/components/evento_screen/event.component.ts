import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionScreenComponent } from '../transaccion-screen/transaccion-screen.component';
import { DocumentoScreenComponent } from "../documento-screen/documento-screen.component";
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-event',
  imports: [CommonModule, FormsModule, TransaccionScreenComponent, DocumentoScreenComponent],
  templateUrl: './event.component.html',
  styleUrl: './evento.component.css',
})
export class EventComponent {

  constructor(
    public theme: ThemeService,
  ) {}

  // Variable para cambiar la pestaña seleccionada entre documento, transacciones y pago
  selectedTab: string = 'documento';

  
}
