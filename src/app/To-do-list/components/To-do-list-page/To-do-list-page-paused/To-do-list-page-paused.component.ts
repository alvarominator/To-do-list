import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { ToDoListEditComponent } from '../../To-do-list-edit/To-do-list-edit.component';

@Component({
  selector: 'to-do-list-page-paused',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, DialogModule, Textarea, FormsModule, ToDoListEditComponent],
  templateUrl: './To-do-list-page-paused.component.html',
})
export class ToDoListPagePausedComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  showDialog = false;
  newTask: Task = this.emptyTask('Paused');
  showEditForm = false;
  selectedTask: Task | null = null;
  private readonly STORAGE_KEY = 'paused-tasks'; // Clave para el Local Storage

  constructor() { }

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.saveTasks(); // Guardar al salir del componente (o al recargar la página)
  }

  loadTasks() {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    console.log('Tareas Paused cargadas:', this.tasks);
  }

  saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    console.log('Tareas Paused guardadas:', this.tasks);
  }

  openDialog() {
    this.newTask = this.emptyTask('Paused');
    this.showDialog = true;
  }

  saveTask() {
    this.newTask.id = crypto.randomUUID();
    const now = new Date();
    this.newTask.createdAt = now;
    this.newTask.updatedAt = now;
    this.tasks.push({ ...this.newTask });
    this.showDialog = false;
    this.newTask = this.emptyTask('Paused');
    this.saveTasks(); // Guardar inmediatamente después de añadir
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
        this.saveTasks(); // Guardar después de editar
      }
    }
  }

  // Nuevo método para manejar la eliminación de la tarea
  onTaskDeleted(taskToDelete: Task) {
    if (taskToDelete && taskToDelete.id) {
      this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
      this.saveTasks(); // Guardar la lista actualizada después de eliminar
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