import { Component } from '@angular/core';
import { ToDoListMenuHeaderComponent } from "./To-do-list-menu-header/To-do-list-menu-header.component";
import { ToDoListMenuCategoriesComponent } from "./To-do-list-menu-categories/To-do-list-menu-categories.component";
import { ToDoListMenuTasksComponent } from "./To-do-list-menu-tasks/To-do-list-menu-tasks.component";
import { ToDoListMenuTagsComponent } from "./To-do-list-menu-tags/To-do-list-menu-tags.component";
import { ToDoListMenuFooterComponent } from "./To-do-list-menu-footer/To-do-list-menu-footer.component";

@Component({
  selector: 'to-do-list-menu',
  imports: [ToDoListMenuHeaderComponent, ToDoListMenuCategoriesComponent, ToDoListMenuTasksComponent, ToDoListMenuTagsComponent, ToDoListMenuFooterComponent],
  templateUrl: './To-do-list-menu.component.html',
})
export class ToDoListMenuComponent { }
