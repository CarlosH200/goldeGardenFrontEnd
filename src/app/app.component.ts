import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FormsModule } from '@angular/forms';
import { EventCalendarComponent } from "./components/event-calendar/event-calendar.component";

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'goldeGardenFrontEnd';
}
