import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // 🔥 ESTA ES TU APP COMPLETA (sidebar + main-content)
  { path: 'home', component: SideBarComponent },

  { path: '**', redirectTo: 'login' }
];
