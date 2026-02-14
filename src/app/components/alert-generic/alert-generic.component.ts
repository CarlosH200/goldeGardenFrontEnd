import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AlertGenericModel } from '../../models/alertGerenicModel';
import { ThemeService } from '../../services/theme.service';


@Component({
  selector: 'app-alert-generic',
  imports: [CommonModule, MatDialogContent, MatDialogActions,MatDialogModule],
  templateUrl: './alert-generic.component.html',
  styleUrl: './alert-generic.component.css',
  standalone: true,
  providers: [ThemeService],
})
export class AlertGenericComponent {
  // Aquí 'data' recibe lo que envíes desde el DocumentoScreen
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertGenericModel, public dialogRef: MatDialogRef<AlertGenericComponent>) { }


  closeDialog(): void {
    this.dialogRef.close(true);
  }

}
