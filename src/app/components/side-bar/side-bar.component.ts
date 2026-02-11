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

  // 🔥 lista del menú
  menu: MenuDisplayModel[] = [];

  // 🔥 ESTE ES EL QUE TE FALTABA
  activeComponent: any = null;

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

  // lo dejamos por si lo usas en otro lado
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // 🔥 esta función activa el item y cambia el componente
  selectMenu(item: MenuDisplayModel) {
    this.menuProvider.setActiveById(item.id);

    // refrescar lista para que el enabled cambie en el HTML
    this.menu = this.menuProvider.getMenu();

    // actualizar el componente que se renderiza
    this.activeComponent = this.menuProvider.getActive()?.component;
  }

  handleLogout() {
  this.authService.logout();      // ✅ borra sesión
  this.router.navigate(['login']); // ✅ sin slash (respeta baseHref)
}

}
