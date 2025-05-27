// src/app/To-do-list/services/task.service.ts
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'all-tasks'; 
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadAllTasks();
  }

  private loadAllTasks(): void {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    const tasks = storedTasks ? JSON.parse(storedTasks, this.dateReviver) : [];
    this.tasksSubject.next(tasks);
  }

  private saveAllTasks(tasksToSave: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasksToSave, this.dateReplacer));
    this.tasksSubject.next(tasksToSave);
    console.log('Todas las tareas guardadas en localStorage:', tasksToSave);
  }

  addTask(newTask: Task): void {
    const currentTasks = this.tasksSubject.value;
    
    //Make sure the new task has an unique ID
    const taskToAdd: Task = {
      ...newTask,
      id: newTask.id || crypto.randomUUID(), //Generate an id
      createdAt: newTask.createdAt || new Date(),
      updatedAt: new Date(),
      status: newTask.status || 'Non Started'
    };

    this.saveAllTasks([...currentTasks, taskToAdd]);
  }

  updateTask(updatedTask: Task): void {
    const currentTasks = this.tasksSubject.value;
    const index = currentTasks.findIndex(t => t.id === updatedTask.id);
    
    if (index !== -1) {
      const tasksCopy = [...currentTasks];
      tasksCopy[index] = { ...updatedTask, updatedAt: new Date() };
      this.saveAllTasks(tasksCopy);
    } else {
      this.addTask(updatedTask); 
    }
  }

  deleteTask(taskId: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== taskId);
    this.saveAllTasks(filteredTasks);
  }

  addCategoryToTask(taskId: string, categoryId: string): void {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const tasksCopy = [...currentTasks];
        const task = { ...tasksCopy[taskIndex] };
        if (!task.categories) {
            task.categories = [];
        }
        if (!task.categories.includes(categoryId)) {
            task.categories.push(categoryId);
            task.updatedAt = new Date();
            tasksCopy[taskIndex] = task;
            this.saveAllTasks(tasksCopy);
        }
    }
  }

  removeCategoryFromTask(taskId: string, categoryId: string): void {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const tasksCopy = [...currentTasks];
        const task = { ...tasksCopy[taskIndex] };
        if (task.categories) {
            const initialLength = task.categories.length;
            task.categories = task.categories.filter(id => id !== categoryId);
            if (task.categories.length !== initialLength) {
                task.updatedAt = new Date();
                tasksCopy[taskIndex] = task;
                this.saveAllTasks(tasksCopy);
            }
        }
    }
  }

  private dateReviver(key: string, value: any): any {
    if (typeof value === 'string' && (key.endsWith('At') || key === 'dueDate')) { 
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date; 
    }
    return value;
  }

  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }
}
