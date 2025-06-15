import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authService';
import { LoginModel } from '../../models/loginModel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SideBarComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoggingIn: boolean = true;
  hidePassword: boolean = true;
  usuario: string = '';
  password: string = '';
  mensaje: string = '';
  success: boolean | null = null;

  constructor(private authService: AuthService) { }

  isLogin(): void {
    // console.log('Intentando iniciar sesión con:', this.usuario, this.password);
    this.authService.login(this.usuario, this.password).subscribe({
      next: (res: LoginModel) => {
        this.success = res.success;
        this.mensaje = res.mensaje;

        if (res.success) {
          // console.log('Login exitoso');
          alert(this.mensaje);

          this.isLoggingIn = true;
          // Aquí puedes guardar token o redirigir
        } else {
          // console.warn('Credenciales inválidas');
          alert(this.mensaje);
          this.isLoggingIn = false;
        }
      },
      error: (err) => {
        this.success = false;
        this.mensaje = 'Error al conectar con el servidor';
        console.error(err);
      }
    });
  }
}
