// src/app/To-do-list/components/To-do-list-edit/To-do-list-edit.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core'; // Importamos OnChanges
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'to-do-list-edit',
  standalone: true,
  templateUrl: './to-do-list-edit.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    Textarea,
    CalendarModule,
    ChipsModule,
    ButtonModule,
    CheckboxModule
  ],
  providers: [TaskService],
})
export class ToDoListEditComponent implements OnInit, OnChanges { // // Implements the OnChanges interface
  @Input() task: Task | null = null; // Input to receive the task to edit
  @Output() closed = new EventEmitter<Task | null>(); // Output to emit when the form is closed
  @Output() deleted = new EventEmitter<Task>();// New Output to emit the task to be deleted

  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService, 
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    this.initForm(); // Re-initializes the form when the input task changes
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      dueDate: [this.task?.dueDate || null],
      tags: [this.task?.tags || []],
      subtasks: this.fb.array(
        this.task?.subtasks?.map(s => this.fb.group({
          title: [s.title],
          isCompleted: [s.isCompleted]
        })) || []
      )
    });
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(
      this.fb.group({
        title: [''],
        isCompleted: [false]
      })
    );
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = {
        id: this.task?.id || crypto.randomUUID(),
        createdAt: this.task?.createdAt || new Date(),
        updatedAt: new Date(),
        status: this.task?.status || 'Non Started',
        ...this.taskForm.value
      };

      this.taskService.updateTask(updatedTask);
      this.closed.emit(updatedTask); // Emits the updated task
           // No navigation here, the parent component will handle the closing
    }
  }

  closeForm(): void {
    this.closed.emit(null); // Emits null to indicate that it was closed without saving
  }

  deleteTask(): void {
    if (this.task?.id) {
      this.deleted.emit(this.task); // Emits the current task for the parent to delete
      this.closeForm(); // Closes the form after requesting deletion
    }
  }
}