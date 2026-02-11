import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';

import { LoginModel } from '../../models/loginModel';
import { ThemeService } from '../../services/theme.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authService';

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
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  isLoading: boolean = false;
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

  ngOnInit(): void {
    // ✅ Si ya está logueado, no tiene sentido mostrar login
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home']); // 👈 sin slash
    }
  }

  ngAfterViewInit(): void {
    this.focusUser();
  }

  private focusUser() {
    setTimeout(() => {
      if (this.userInput?.nativeElement) {
        this.userInput.nativeElement.focus();
      }
    }, 200);
  }

  isLogin(): void {
    if (!this.usuario || !this.password) {
      this.snackBar.open('Ingrese usuario y contraseña', 'Cerrar', {
        duration: 2500,
        panelClass: ['alerta-error'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.focusUser();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.usuario, this.password).subscribe({
      next: (res: LoginModel) => {
        this.success = res.success;
        this.mensaje = res.mensaje;

        if (res.success) {
          this.snackBar.open(this.mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: ['alerta-exito'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          // ✅ Navegar respetando el baseHref (SIN slash)
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['home']);
          }, 800);

        } else {
          this.isLoading = false;

          this.snackBar.open(this.mensaje, 'Cerrar', {
            duration: 3000,
            panelClass: ['alerta-error'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

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
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        console.error(err);
        this.focusUser();
      }
    });
  }
}
