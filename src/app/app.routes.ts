import { Routes } from '@angular/router';
import { ToDoListPageComponent } from './To-do-list/components/To-do-list-page/To-do-list-page.component';
import { ToDoListLayoutComponent } from './To-do-list/layout/To-do-list-layout/To-do-list-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ToDoListLayoutComponent,
    children: [
      {
        path: '',
        component: ToDoListPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
