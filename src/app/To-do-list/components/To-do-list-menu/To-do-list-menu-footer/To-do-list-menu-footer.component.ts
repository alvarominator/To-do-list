import { Component, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { NgIf, CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'to-do-list-menu-footer',
  imports: [ButtonModule, CalendarComponent, NgIf, CommonModule],
  templateUrl: './To-do-list-menu-footer.component.html',
  styleUrls: ['./To-do-list-menu-footer.component.css']
})
export class ToDoListMenuFooterComponent implements OnDestroy {
  showCalendar: boolean = false;
  showTaskPopup: boolean = false;
  selectedDateTasks: Task[] = [];
  tasksSubscription?: Subscription;
  allTasks: Task[] = [];
  selectedDate: Date | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
    this.showTaskPopup = false;
    this.selectedDateTasks = [];
    this.selectedDate = null;
  }

  signOut() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  handleDateSelected(date: Date): void {
    this.selectedDate = date;
    this.selectedDateTasks = this.allTasks.filter(task => {
      if (task.dueDate) {
        const taskDueDate = new Date(task.dueDate);
        return taskDueDate.getFullYear() === date.getFullYear() &&
               taskDueDate.getMonth() === date.getMonth() &&
               taskDueDate.getDate() === date.getDate();
      }
      return false;
    });
    this.showTaskPopup = true; // show pop up
    console.log('Tareas para la fecha seleccionada:', this.selectedDateTasks);
  }

  closeTaskPopup(): void {
    this.showTaskPopup = false;
    this.selectedDate = null;
    this.selectedDateTasks = [];
  }
}