// src/app/To-do-list/components/to-do-list-task-page/to-do-list-page-tasks.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { Subscription, combineLatest, of } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { ToDoListEditComponent } from '../To-do-list-edit/To-do-list-edit.component';

// Define the status of the tasks
type TaskStatus = 'Non Started' | 'In Progress' | 'Paused' | 'Late' | 'Finished';

@Component({
  selector: 'to-do-list-page-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    Textarea,
    FormsModule,
    ToDoListEditComponent,
    TagModule
  ],
  templateUrl: './to-do-list-page-tasks.component.html',
  providers: [DatePipe]
})
export class ToDoListPageTasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  showDialog = false;
  newTask: Task = this.emptyTask('Non Started');
  showEditForm = false;
  selectedTask: Task | null = null;
  categories: Category[] = [];
  currentStatus: TaskStatus = 'Non Started';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private datePipe: DatePipe,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      combineLatest([
        this.route.paramMap.pipe(
          map(params => params.get('status') as TaskStatus || 'Non Started')
        ),
        this.taskService.tasks$,
        this.categoryService.getCategories()
      ]).pipe(
        map(([status, allTasks, categories]) => {
          this.currentStatus = status;
          this.categories = categories;
          return allTasks.filter(task => task.status === status);
        })
      ).subscribe(filteredTasks => {
        this.tasks = filteredTasks;
        console.log(`Task for the state '${this.currentStatus}' loaded:`, this.tasks);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openDialog() {
    this.newTask = this.emptyTask(this.currentStatus);
    this.showDialog = true;
  }

  saveTask() {
    this.taskService.addTask(this.newTask);
    this.showDialog = false;
    this.newTask = this.emptyTask(this.currentStatus);
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
      this.taskService.updateTask(taskUpdated);
    }
  }

  onTaskDeleted(taskToDelete: Task) {
    if (taskToDelete && taskToDelete.id) {
      this.taskService.deleteTask(taskToDelete.id);
      this.selectedTask = null;
      this.showEditForm = false;
    }
  }

  private emptyTask(status: TaskStatus): Task {
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

  get pageTitle(): string {
    switch (this.currentStatus) {
      case 'Non Started': return 'Non Started Tasks';
      case 'In Progress': return 'In progress Tasks';
      case 'Paused': return 'Paused Tasks';
      case 'Late': return 'Late Tasks';
      case 'Finished': return 'Finished Tasks';
      default: return 'Tasks';
    }
  }

  get noTasksMessage(): string {
    switch (this.currentStatus) {
      case 'Non Started': return 'No Non Started Tasks yet.';
      case 'In Progress': return 'No In Progress Tasks yet.';
      case 'Paused': return 'No Paused Tasks yet.';
      case 'Late': return 'No Late Tasks yet.';
      case 'Finished': return 'No Finished Tasks yet.';
      default: return 'No Tasks yet.';
    }
  }
}
