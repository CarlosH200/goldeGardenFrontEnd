import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/authService';

import { MenuDisplayProvider } from '../../providers/menu.displays.provider';
import { MenuDisplayModel } from '../../models/menuDisplaysModel';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  // lista del menú
  menu: MenuDisplayModel[] = [];

  // componente activo a renderizar
  activeComponent: any = null;

  // Estado del menú lateral (desplegable)
  isSidebarOpen: boolean = false;

  constructor(
    private router: Router,
    public theme: ThemeService,
    private authService: AuthService,
    private menuProvider: MenuDisplayProvider
  ) {
    this.menu = this.menuProvider.getMenu();

    // cargar componente activo inicial
    this.activeComponent = this.menuProvider.getActive()?.component;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  selectMenu(item: MenuDisplayModel) {
    this.menuProvider.setActiveById(item.id);

    // refrescar lista para que el enabled cambie en el HTML
    this.menu = this.menuProvider.getMenu();

    // actualizar el componente que se renderiza
    this.activeComponent = this.menuProvider.getActive()?.component;

    // ocultar automáticamente el menú lateral al seleccionar un módulo
    this.closeSidebar();
  }

  handleLogout() {
    this.authService.logout();      //borra sesión
    this.router.navigate(['login']); //sin slash (respeta baseHref)
  }

}
