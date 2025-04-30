import { Routes } from '@angular/router';
import { authGuard } from './To-do-list/auth/auth.guard';
import { AuthFormComponent } from './To-do-list/auth/auth-form/auth-form.component';
import { ToDoListLayoutComponent } from './To-do-list/layout/To-do-list-layout/To-do-list-layout.component';
import { NonStartedPageComponent } from './To-do-list/pages/non-started-page/non-started-page.component';
import { InProgressPageComponent } from './To-do-list/pages/in-progress-page/in-progress-page.component';
import { PausedPageComponent } from './To-do-list/pages/paused-page/paused-page.component';
import { LatePageComponent } from './To-do-list/pages/late-page/late-page.component';
import { FinishedPageComponent } from './To-do-list/pages/finished-page/finished-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthFormComponent
  },
  {
    path: 'register',
    component: AuthFormComponent
  },
  {
    path: '',
    component: ToDoListLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'non-started', pathMatch: 'full' },
      { path: 'non-started', component: NonStartedPageComponent },
      { path: 'in-progress', component: InProgressPageComponent },
      { path: 'paused', component: PausedPageComponent },
      { path: 'late', component: LatePageComponent },
      { path: 'finished', component: FinishedPageComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

