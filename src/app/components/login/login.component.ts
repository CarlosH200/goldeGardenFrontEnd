import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { AuthService } from '../../services/authService';
import { LoginModel } from '../../models/loginModel';
import { ThemeService } from '../../services/theme.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  isLoading: boolean = false; //reggreasr a false despues
  hidePassword: boolean = true;

  usuario: string = '';
  password: string = '';
  mensaje: string = '';
  success: boolean | null = null;

  constructor(
    private authService: AuthService,
    public theme: ThemeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.focusUser();
  }

  // esta función se encarga de enfocar el input del usuario después de que la vista se haya inicializado
  private focusUser() {
    setTimeout(() => {
      if (this.userInput?.nativeElement) {
        this.userInput.nativeElement.focus();
      }
    }, 200); //delay real para que no lo pierda por el DOM
  }

  isLogin(): void {
    this.isLoading = true;

    this.authService.login(this.usuario, this.password).subscribe({
      next: (res: LoginModel) => {
        this.success = res.success;
        this.mensaje = res.mensaje;

        if (res.success) {
          this.snackBar.open(this.mensaje, 'Cerrar', {
            duration: 4000,
            panelClass: ['alerta-exito'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/home']);
          }, 1500);

        } else {
          this.isLoading = false;

          this.snackBar.open(this.mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: ['alerta-error'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          //cuando falla, volver a enfocar input usuario
          this.focusUser();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.success = false;
        this.mensaje = 'Error al conectar con el servidor';

        this.snackBar.open(this.mensaje, 'Cerrar', {
          duration: 3000,
          panelClass: ['alerta-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        console.error(err);

        // al generar error también enfoca input usuario
        this.focusUser();
      }
    });
  }
}
