import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AlertGenericModel } from '../../models/alertGerenicModel';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-alert-generic',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './alert-generic.component.html',
  styleUrls: ['./alert-generic.component.css'],
  standalone: true,
  providers: [ThemeService],
})
export class AlertGenericComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AlertGenericModel,
    public dialogRef: MatDialogRef<AlertGenericComponent>
  ) {}

  // 🔹 Método opcional para cerrar manualmente con un resultado
  closeDialog(result: string = 'cancelar'): void {
    this.dialogRef.close(result);
  }
}
