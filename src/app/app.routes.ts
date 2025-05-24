import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventComponent } from './components/event/event.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'EventCalendar', component: EventCalendarComponent },
  { path: 'Event', component: EventComponent },
  { path: '**', redirectTo: 'inicio' }
];
