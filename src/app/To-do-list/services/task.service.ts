import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = this.loadTasks();
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.tasksSubject.asObservable();
  private readonly STORAGE_KEY = 'all-tasks'; // Una única clave para todas las tareas

  constructor() { }

  private loadTasks(): Task[] {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
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

  // Métodos adicionales para seleccionar tareas si los necesitas
  private selectedTask: Task | null = null;
  private selectedTaskSubject = new BehaviorSubject<Task | null>(null);
  selectedTask$ = this.selectedTaskSubject.asObservable();

  selectTask(task: Task): void {
    this.selectedTask = { ...task };
    this.selectedTaskSubject.next({ ...task });
  }

  getSelectedTask(): Task | null {
    return this.selectedTask ? { ...this.selectedTask } : null;
  }

  clearSelectedTask(): void {
    this.selectedTask = null;
    this.selectedTaskSubject.next(null);
  }
}