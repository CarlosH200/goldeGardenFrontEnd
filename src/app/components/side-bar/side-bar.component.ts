import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
   isSidebarClosed = false;

  constructor(
    private router: Router,
    public theme: ThemeService,
    private authService: AuthService,
  ) {}

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isSidebarClosed = true;
  }

  // DEBE CAMBIAR AL TENER TOKENS INTEGRADOS
  // Servicio para cerrar sesion reiniciando la app
  handleLogout() {
    // 💡 Llama a la nueva función
    this.authService.logoutAndReload(); 
}

}
