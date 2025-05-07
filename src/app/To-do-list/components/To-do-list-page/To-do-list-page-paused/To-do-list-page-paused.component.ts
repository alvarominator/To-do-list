// src/app/To-do-list/components/To-do-list-page/To-do-list-page-paused/To-do-list-page-paused.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { Subscription } from 'rxjs';
import { ToDoListEditComponent } from '../../To-do-list-edit/To-do-list-edit.component';

@Component({
  selector: 'to-do-list-page-paused',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, Textarea, ToDoListEditComponent],
  templateUrl: './to-do-list-page-paused.component.html',
})
export class ToDoListPagePausedComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  showDialog = false;
  newTask: Task = this.emptyTask('Paused');
  showEditForm = false;
  selectedTask: Task | null = null;
  private tasksSubscription?: Subscription;

  constructor(
    private taskService: TaskService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.tasksSubscription = this.taskService.tasks$.subscribe(allTasks => {
      this.tasks = allTasks.filter(task => task.status === 'Paused');
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  openDialog() {
    this.newTask = this.emptyTask('Paused');
    this.showDialog = true;
  }

  saveTask() {
    this.newTask.id = crypto.randomUUID();
    this.newTask.createdAt = new Date();
    this.newTask.updatedAt = new Date();
    this.taskService.addTask(this.newTask);
    this.showDialog = false;
  }

  editTask(task: Task) {
    this.selectedTask = { ...task };
    this.showEditForm = true;
  }

  openEditForm(task: Task) {
    this.selectedTask = { ...task };
    this.showEditForm = true;
  }

  onEditFormClosed(taskUpdated: Task | null) {
    this.showEditForm = false;
    this.selectedTask = null;
    if (taskUpdated) {
      this.taskService.updateTask(taskUpdated);
    }
  }

  // Asegúrate de que la firma de este método sea correcta
  onTaskDeleted(taskToDelete: Task) {
    if (taskToDelete && taskToDelete.id) {
      this.taskService.deleteTask(taskToDelete.id);
      this.selectedTask = null;
      this.showEditForm = false;
    }
  }

  private emptyTask(status: 'Non Started' | 'In Progress' | 'Paused' | 'Late' | 'Finished'): Task {
    return {
      id: '',
      title: '',
      description: '',
      status: status,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
    };
  }
}