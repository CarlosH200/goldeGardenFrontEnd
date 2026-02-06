import { Injectable, Type } from '@angular/core';
import { MenuDisplayModel } from '../models/menuDisplaysModel';

// Importa los componentes que vas a mostrar
import { EventComponent } from '../components/evento_screen/event.component';
import { EventCalendarComponent } from '../components/event-calendar/event-calendar.component';


@Injectable({
  providedIn: 'root'
})
export class MenuDisplayProvider {

  private items: MenuDisplayModel[] = [
    {
      id: 1,
      nombre: 'Eventos',
      component: EventComponent,
      enabled: true,
      icon: 'event_available'
    },
    {
      id: 2,
      nombre: 'Calendario Eventos',
      component: EventCalendarComponent,
      enabled: false,
      icon: 'calendar_month'
    },
 
  ];

  getMenu(): MenuDisplayModel[] {
    return this.items;
  }

  setActiveById(id: number): void {
    this.items.forEach(x => x.enabled = (x.id === id));
  }

  getActive(): MenuDisplayModel | undefined {
    return this.items.find(x => x.enabled);
  }
}
