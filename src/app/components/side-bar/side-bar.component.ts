import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule,RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
   isSidebarClosed = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isSidebarClosed = true;
  }
}
