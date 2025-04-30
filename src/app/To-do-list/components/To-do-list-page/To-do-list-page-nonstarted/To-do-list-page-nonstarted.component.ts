import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TaskService, Task } from '../../../services/task.service';

@Component({
  selector: 'to-do-list-page-nonstarted',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './To-do-list-page-nonstarted.component.html',
})
export class ToDoListPageNonStartedComponent implements OnInit {
  tasks: Task[] = [];
  showDialog = false;
  newTask: Task = { id: 0, title: '', description: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.tasks = this.taskService.getTasks();
  }

  openDialog() {
    this.newTask = { id: 0, title: '', description: '' };
    this.showDialog = true;
  }

  saveTask() {
    this.taskService.addTask(this.newTask);
    this.tasks = this.taskService.getTasks();
    this.showDialog = false;
  }

  editTask(task: Task) {
    this.taskService.selectTask(task);
  }
}
