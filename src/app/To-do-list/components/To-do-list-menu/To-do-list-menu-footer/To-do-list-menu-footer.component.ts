import {Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'to-do-list-menu-footer',
  imports: [ButtonModule],
  templateUrl: './To-do-list-menu-footer.component.html',
  styleUrl: './To-do-list-menu-footer.component.css',
})
export class ToDoListMenuFooterComponent { constructor(
  private auth: AuthService,
  private router: Router
) {}

signOut() {
  this.auth.logout();
  this.router.navigateByUrl('/login');
}
}