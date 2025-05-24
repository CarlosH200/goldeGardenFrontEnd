import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  imports: [
    SideBarComponent,
    LoginComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'goldeGardenFrontEnd';
}
