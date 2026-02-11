import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { authGuard } from './guards/auth.duard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: SideBarComponent,
    canMatch: [authGuard] // 🔥 en vez de canActivate
  },

  { path: '**', redirectTo: 'home' }
];
