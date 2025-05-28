import { Component } from '@angular/core';
import { ToDoListMenuComponent } from "../../components/To-do-list-menu/To-do-list-menu.component";
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'to-do-list-layout',
  imports: [ToDoListMenuComponent, RouterOutlet, ToastModule],
  templateUrl: './To-do-list-layout.component.html',
})
export class ToDoListLayoutComponent { }
