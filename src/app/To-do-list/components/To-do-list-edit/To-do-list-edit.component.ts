// src/app/To-do-list/components/to-do-list-edit/to-do-list-edit.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Subscription, Observable } from 'rxjs';
import { TagService } from '../../services/tag.service';
import { SelectModule } from 'primeng/select';

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
        DropdownModule,
        TagModule,
        SelectModule
    ],
})
export class ToDoListEditComponent implements OnInit, OnChanges, OnDestroy {
    @Input() task: Task | null = null;
    @Output() closed = new EventEmitter<Task | null>();
    @Output() deleted = new EventEmitter<Task>();

    taskForm!: FormGroup;
    categories: Category[] = [];
    categoriesSubscription?: Subscription;
    selectedCategory: Category | null = null;
    availableTags: string[] = [];
    tagsSubscription?: Subscription;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private router: Router,
        private categoryService: CategoryService,
        private tagService: TagService // Inject TagService
    ) { }

    ngOnInit(): void {
        this.categoriesSubscription = this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
        });

        this.tagsSubscription = this.tagService.tags$.subscribe(tags => {  // Get the tags from service
            this.availableTags = tags;
        });
        this.initForm();
    }

    ngOnChanges(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        if (this.categoriesSubscription) {
            this.categoriesSubscription.unsubscribe();
        }
        if (this.tagsSubscription) {
            this.tagsSubscription.unsubscribe();
        }
    }

    initForm(): void {
        // Inicializa selectedCategory basado en this.task
        let foundCategory: Category | undefined;
        if (this.task?.categories?.length) {
            foundCategory = this.categories.find(cat => this.task?.categories?.[0] && cat.id === this.task.categories[0]);
        }

        this.taskForm = this.fb.group({
            title: [this.task?.title || '', Validators.required],
            description: [this.task?.description || ''],
            dueDate: [this.task?.dueDate || null],
            tags: [this.task?.tags || []], // Use tags from tasks
            category: [foundCategory || null], // Use object category, not only id
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

    clearCategory(): void {
        this.taskForm.get('category')?.setValue(null);
    }

    saveTask(): void {
        if (this.taskForm.valid) {
            const selectedCategory = this.taskForm.value.category;
            const selectedCategoryId = selectedCategory ? [selectedCategory.id] : [];
            const updatedTask: Task = {
                id: this.task?.id || crypto.randomUUID(),
                createdAt: this.task?.createdAt || new Date(),
                updatedAt: new Date(),
                status: this.taskForm.value.status || 'Non Started',
                title: this.taskForm.value.title,
                description: this.taskForm.value.description,
                dueDate: this.taskForm.value.dueDate,
                tags: this.taskForm.value.tags || [], // Use tags in the form
                subtasks: this.taskForm.value.subtasks,
                categories: selectedCategoryId, //Use id in selected Category
            };
            this.taskService.updateTask(updatedTask);
            this.closed.emit(updatedTask);
        }
    }

    closeForm(): void {
        this.closed.emit(null);
    }

    deleteTask(): void {
        if (this.task?.id) {
            this.deleted.emit(this.task);
            this.closeForm();
        }
    }
}
/* // src/app/To-do-list/components/to-do-list-edit/to-do-list-edit.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Subscription } from 'rxjs';

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
    DropdownModule,
    TagModule,
  ],
})
export class ToDoListEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() task: Task | null = null;
  @Output() closed = new EventEmitter<Task | null>();
  @Output() deleted = new EventEmitter<Task>();

  taskForm!: FormGroup;
  categories: Category[] = [];
  categoriesSubscription?: Subscription;
  selectedCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.initForm();
    });
  }

  ngOnChanges(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  initForm(): void {
    // Inicialize selectedCategory based in this.task
    let foundCategory: Category | undefined;
    if (this.task?.categories?.length) {
      foundCategory = this.categories.find(cat => this.task?.categories?.[0] && cat.id === this.task.categories[0]);
    }
    this.selectedCategory = foundCategory ? foundCategory : null;

    this.taskForm = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      dueDate: [this.task?.dueDate || null],
      tags: [this.task?.tags || []],
      category: [this.selectedCategory],
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

  clearCategory(): void {
    this.selectedCategory = null;
    this.taskForm.get('category')?.setValue(null);
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const selectedCategoryId = this.taskForm.value.category ? [this.taskForm.value.category.id] : [];

      const updatedTask: Task = {
        id: this.task?.id || crypto.randomUUID(),
        createdAt: this.task?.createdAt || new Date(),
        updatedAt: new Date(),
        status: this.taskForm.value.status || 'Non Started',
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        dueDate: this.taskForm.value.dueDate,
        tags: [this.taskForm.value.tags || []],
        subtasks: this.taskForm.value.subtasks,
        categories: selectedCategoryId,
      };

      this.taskService.updateTask(updatedTask);
      this.closed.emit(updatedTask);
    }
  }

  closeForm(): void {
    this.closed.emit(null);
  }

  deleteTask(): void {
    if (this.task?.id) {
      this.deleted.emit(this.task);
      this.closeForm();
    }
  }
} */