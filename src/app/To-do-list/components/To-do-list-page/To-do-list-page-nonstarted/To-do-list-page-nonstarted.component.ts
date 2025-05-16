import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { ToDoListEditComponent } from '../../To-do-list-edit/To-do-list-edit.component';
import { TagModule } from 'primeng/tag';
import { Category } from '../../../models/category.model';

@Component({
    selector: 'to-do-list-page-nonstarted',
    standalone: true,
    imports: [CommonModule, ButtonModule, InputTextModule, DialogModule, Textarea, FormsModule, ToDoListEditComponent, TagModule],
    templateUrl: './to-do-list-page-nonstarted.component.html',
    providers: [DatePipe]
})
export class ToDoListPageNonStartedComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    showDialog = false;
    newTask: Task = this.emptyTask('Non Started');
    showEditForm = false;
    selectedTask: Task | null = null;
     categories: Category[] = [];
    private readonly STORAGE_KEY = 'nonstarted-tasks';

    constructor(private datePipe: DatePipe) { }

    ngOnInit() {
        this.loadTasks();
    }

    ngOnDestroy() {
        this.saveTasks();
    }

    loadTasks() {
        const storedTasks = localStorage.getItem(this.STORAGE_KEY);
        this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
        console.log('Tareas Non Started cargadas:', this.tasks);
    }

    saveTasks() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
        console.log('Tareas Non Started guardadas:', this.tasks);
    }

    openDialog() {
        this.newTask = this.emptyTask('Non Started');
        this.showDialog = true;
    }

    saveTask() {
        this.newTask.id = crypto.randomUUID();
        const now = new Date();
        this.newTask.createdAt = now;
        this.newTask.updatedAt = now;
        this.tasks.push({ ...this.newTask });
        this.showDialog = false;
        this.newTask = this.emptyTask('Non Started');
        this.saveTasks();
    }

      getCategoryName(categoryId: string): string {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown Category';
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
            const index = this.tasks.findIndex(t => t.id === taskUpdated.id);
            if (index !== -1) {
                this.tasks[index] = { ...taskUpdated };
                this.saveTasks();
            }
        }
    }

    onTaskDeleted(taskToDelete: Task) {
        if (taskToDelete && taskToDelete.id) {
            this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
            this.saveTasks();
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
             dueDate: undefined,
            categories: [],
            tags: [],
        };
    }
}
/* import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { ToDoListEditComponent } from '../../To-do-list-edit/To-do-list-edit.component';

@Component({
  selector: 'to-do-list-page-nonstarted',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, DialogModule, Textarea, FormsModule, ToDoListEditComponent],
  templateUrl: './To-do-list-page-nonstarted.component.html',
})
export class ToDoListPageNonStartedComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  showDialog = false;
  newTask: Task = this.emptyTask('Non Started');
  showEditForm = false;
  selectedTask: Task | null = null;
  private readonly STORAGE_KEY = 'nonstarted-tasks'; // Key for the Local Storage

  constructor() { }

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.saveTasks(); // Save when leaving the component (or on page reload)
  }

  loadTasks() {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    console.log('Tareas Non Started cargadas:', this.tasks);
  }

  saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    console.log('Tareas Non Started guardadas:', this.tasks);
  }

  openDialog() {
    this.newTask = this.emptyTask('Non Started');
    this.showDialog = true;
  }

  saveTask() {
    this.newTask.id = crypto.randomUUID();
    const now = new Date();
    this.newTask.createdAt = now;
    this.newTask.updatedAt = now;
    this.tasks.push({ ...this.newTask });
    this.showDialog = false;
    this.newTask = this.emptyTask('Non Started');
    this.saveTasks(); // Save immediately after adding
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
      const index = this.tasks.findIndex(t => t.id === taskUpdated.id);
      if (index !== -1) {
        this.tasks[index] = { ...taskUpdated };
        this.saveTasks(); // Save after editing
      }
    }
  }

   // New method to handle task deletion
  onTaskDeleted(taskToDelete: Task) {
    if (taskToDelete && taskToDelete.id) {
      this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
      this.saveTasks(); // Save the updated list after deleting
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
} */