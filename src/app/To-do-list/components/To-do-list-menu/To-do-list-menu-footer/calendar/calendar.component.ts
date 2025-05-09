import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../../../services/task.service';
import { Task } from '../../../../models/task.model';
import { Subscription } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [DatePickerModule, CommonModule]
})
export class CalendarComponent implements OnInit, OnDestroy {
  tasksWithDueDate: Task[] = [];
  eventDays: Date[] = [];
  tasksSubscription?: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasksWithDueDate = tasks.filter(task => task.dueDate);
      this.eventDays = this.tasksWithDueDate.map(task => new Date(task.dueDate!));
      console.log('eventDays:', this.eventDays);
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  isEventDay = (date: Date): boolean => {
    return this.eventDays.some(eventDate =>
      eventDate.toDateString() === date.toDateString()
    );
  };

  onDaySelect(event: any): void {
    const selectedDate = event.date;
    const tasksOnSelectedDate = this.tasksWithDueDate.filter(
      task => new Date(task.dueDate!).toDateString() === selectedDate.toDateString()
    );
    if (tasksOnSelectedDate.length > 0) {
      console.log('Tareas para el', selectedDate, ':', tasksOnSelectedDate);
      // Aquí podrías emitir un evento al footer para mostrar las tareas
    }
  }
}