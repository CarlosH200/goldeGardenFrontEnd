import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EventComponent } from './components/event/event.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';

export const routes: Routes = [
  { path: 'EventCalendar', component: EventCalendarComponent },
  { path: '', redirectTo: 'EventCalendar', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'Event', component: EventComponent },
  { path: '**', redirectTo: 'EventCalendar' }
];
