import { Type } from '@angular/core';

export interface MenuDisplayModel {
  id: number;
  nombre: string;
  component: Type<any>;
  enabled: boolean;
  icon: string;
}
