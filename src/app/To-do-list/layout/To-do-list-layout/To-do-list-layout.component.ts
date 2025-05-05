import { Component } from '@angular/core';
import { ToDoListMenuComponent } from "../../components/To-do-list-menu/To-do-list-menu.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'to-do-list-layout',
  imports: [ToDoListMenuComponent, RouterOutlet],
  templateUrl: './To-do-list-layout.component.html',
})
export class ToDoListLayoutComponent { }
