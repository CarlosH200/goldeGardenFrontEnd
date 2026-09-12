import { Injectable, Type } from '@angular/core';
import { MenuDisplayModel } from '../models/menuDisplaysModel';

// Importa los componentes que vas a mostrar
import { EventComponent } from '../components/evento_screen/event.component';
import { EventCalendarComponent } from '../components/event-calendar/event-calendar.component';
import { CreateClientComponent } from '../components/create-client/create-client.component';


@Injectable({
  providedIn: 'root'
})
export class MenuDisplayProvider {

  private items: MenuDisplayModel[] = [
    {
      id: 1,
      nombre: 'Eventos',
      component: EventComponent,
      enabled: false,
      icon: 'event_available'
    },
    {
      id: 2,
      nombre: 'Calendario Eventos',
      component: EventCalendarComponent,
      enabled: true,
      icon: 'calendar_month'
    },
    {
      id: 3,
      nombre: 'Clientes',
      component: CreateClientComponent,
      enabled: false,
      icon: 'group_add'
    },
    {
      id: 4,
      nombre: 'Inventario',
      component: EventCalendarComponent, // Cambia esto al componente de configuración real si existe
      enabled: false,
      icon: 'inventory_2'
    }

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
