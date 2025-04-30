import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate?: string;
  list?: string;
  tags?: string[];
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  private selectedTask: Task | null = null;

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task) {
    task.id = Date.now();
    this.tasks.push({ ...task });
  }

  updateTask(updated: Task) {
    const index = this.tasks.findIndex(t => t.id === updated.id);
    if (index !== -1) this.tasks[index] = { ...updated };
  }

  selectTask(task: Task) {
    this.selectedTask = { ...task };
  }

  getSelectedTask(): Task | null {
    return this.selectedTask;
  }
}
