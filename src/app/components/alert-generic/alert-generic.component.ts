import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions,MatDialogRef } from '@angular/material/dialog';
import { AlertGenericModel } from '../../models/alertGerenicModel';


@Component({
  selector: 'app-alert-generic',
  imports: [CommonModule, MatDialogContent, MatDialogActions,],
  templateUrl: './alert-generic.component.html',
  styleUrl: './alert-generic.component.css'
})
export class AlertGenericComponent {
// Aquí 'data' recibe lo que envíes desde el DocumentoScreen
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertGenericModel, public dialogRef: MatDialogRef<AlertGenericComponent>) {}

  
  cerrar(): void {
    this.dialogRef.close(true);
  }

}
