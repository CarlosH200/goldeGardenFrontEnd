import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { CommonModule } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-login',
  imports: [FormsModule, SideBarComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  hidePassword: boolean = true;
  username: string = '';
  password: string = '';

  isLoggingIn: boolean = false;

  validUsername: String = '';
  validPassword: String = '';

  isLoginValid() {
    console.log('Validando credenciales...');

    if (
      this.username == this.validUsername &&
      this.password == this.validPassword
    ) {
      // console.log('valido:', this.username, this.password);

      this.isLoggingIn = true;  // Credenciales válidas
    } else {
      // console.log('invalido:', this.username, this.password);

      this.isLoggingIn = false; // Credenciales incorrectas
      alert('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    }
  }

}
