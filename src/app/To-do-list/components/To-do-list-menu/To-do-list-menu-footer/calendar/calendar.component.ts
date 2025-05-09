import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  @Output() dateSelected = new EventEmitter<Date>();
  tasksWithDueDate: Task[] = [];
  eventDays: Date[] = [];
  tasksSubscription?: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasksWithDueDate = tasks.filter(task => task.dueDate);
      this.eventDays = this.tasksWithDueDate.map(task => new Date(task.dueDate!));
      console.log('eventDays:', this.eventDays); // Para depuración
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  isEventDay = (date: Date): boolean => {
    return this.eventDays.some(eventDate =>
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  };

  onDaySelect(event: any): void {
    this.dateSelected.emit(event.date);
  }
}