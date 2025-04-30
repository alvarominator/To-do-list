import {Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'to-do-list-menu-tasks',
  imports: [ButtonModule, RouterLink],
  templateUrl: './To-do-list-menu-tasks.component.html',
})
export class ToDoListMenuTasksComponent { }
