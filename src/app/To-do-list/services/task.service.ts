// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = this.loadTasks();
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.tasksSubject.asObservable();
  private readonly STORAGE_KEY = 'all-tasks';

  constructor() { }

  private loadTasks(): Task[] {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks, (key, value) => {
      if (key === 'dueDate' && value) {
        return new Date(value);
      }
      if (key === 'createdAt' && value) {
        return new Date(value);
      }
      if (key === 'updatedAt' && value) {
        return new Date(value);
      }
      return value;
    }) : [];
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    this.tasksSubject.next(this.tasks);
    console.log('Tareas guardadas:', this.tasks);
  }

  addTask(task: Task): void {
    this.tasks.push({ ...task });
    this.saveTasks();
  }

  updateTask(updated: Task): void {
    const index = this.tasks.findIndex(t => t.id === updated.id);
    if (index !== -1) {
      updated.updatedAt = new Date();
      this.tasks[index] = { ...updated };
      this.saveTasks();
    }
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  addCategoryToTask(taskId: string, categoryId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      if (!task.categories) {
        task.categories = [];
      }
      if (!task.categories.includes(categoryId)) {
        task.categories.push(categoryId);
        task.updatedAt = new Date();
        this.saveTasks();
      }
    }
  }

  removeCategoryFromTask(taskId: string, categoryId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.categories) {
      const initialLength = task.categories.length;
      task.categories = task.categories.filter(id => id !== categoryId);
      if (task.categories.length !== initialLength) {
        task.updatedAt = new Date();
        this.saveTasks();
      }
    }
  }
}
