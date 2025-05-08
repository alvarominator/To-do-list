import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { NgIf } from '@angular/common'; // Importa NgIf

@Component({
  selector: 'to-do-list-menu-footer',
  imports: [ButtonModule, CalendarComponent, NgIf], // Añade NgIf a los imports
  templateUrl: './To-do-list-menu-footer.component.html',
})
export class ToDoListMenuFooterComponent {
  showCalendar: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  signOut() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}