import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authService';
import { LoginModel } from '../../models/loginModel';
import { ThemeService } from '../../services/theme.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    SideBarComponent,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  // variable para validar el estado de carga
  isLoading: boolean = false;
  // Variale para validar si el usuario inicio sesión correctamente
  isLoggingIn: boolean = false;
  // Variable para mostrar u ocultar la contraseña
  hidePassword: boolean = true;
  usuario: string = '';
  password: string = '';
  mensaje: string = '';
  success: boolean | null = null;

  // inyeccion de los services
  constructor(
    private authService: AuthService,  
    public theme: ThemeService,
    private snackBar: MatSnackBar
  ) { }

isLogin(): void {
  this.isLoading = true; 

  this.authService.login(this.usuario, this.password).subscribe({
    next: (res: LoginModel) => {
      this.success = res.success;
      this.mensaje = res.mensaje;

      if (res.success) {
        // Restauramos tu configuración original de éxito
        this.snackBar.open(this.mensaje, 'Cerrar', {
          duration: 3000,
          panelClass: ['alerta-exito'], 
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        setTimeout(() => {
          this.isLoading = false;
          this.isLoggingIn = true;
        }, 1500); 

      } else {
        this.isLoading = false;
        // Restauramos tu configuración original de error
        this.snackBar.open(this.mensaje, 'Cerrar', {
          duration: 3000,
          panelClass: ['alerta-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        this.isLoggingIn = false;
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.success = false;
      this.mensaje = 'Error al conectar con el servidor';
      // Restauramos tu configuración original de error de red
      this.snackBar.open(this.mensaje, 'Cerrar', {
        duration: 3000,
        panelClass: ['alerta-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      console.error(err);
    }
  });
}
}
