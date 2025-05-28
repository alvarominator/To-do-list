// src/app/To-do-list/components/to-do-list-edit/to-do-list-edit.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect'; 
import { DropdownModule } from 'primeng/dropdown'; 
import { CheckboxModule } from 'primeng/checkbox';
import { Task } from '../../models/task.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Subscription } from 'rxjs';
import { TagService } from '../../services/tag.service';
import { TaskService } from '../../services/task.service';

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
        TagModule,
        MultiSelectModule,
        DropdownModule,
        CheckboxModule
    ],
})
export class ToDoListEditComponent implements OnInit, OnChanges, OnDestroy {
    @Input() task: Task | null = null;
    @Output() closed = new EventEmitter<Task | null>();
    @Output() deleted = new EventEmitter<Task>();

    taskForm!: FormGroup;
    categories: Category[] = [];
    categoriesSubscription?: Subscription;
    availableTags: string[] = [];
    tagsSubscription?: Subscription;

    taskStatuses = [
      { name: 'Non Started', value: 'Non Started' },
      { name: 'In Progress', value: 'In Progress' },
      { name: 'Paused', value: 'Paused' },
      { name: 'Late', value: 'Late' },
      { name: 'Finished', value: 'Finished' }
    ];

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private categoryService: CategoryService,
        private tagService: TagService
    ) { }

    ngOnInit(): void {
        this.categoriesSubscription = this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
            this.initForm(); 
        });

        this.tagsSubscription = this.tagService.tags$.subscribe(tags => {
            this.availableTags = tags;
            this.initForm(); 
        });
        if (!this.categoriesSubscription && !this.tagsSubscription) {
          this.initForm();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['task'] && changes['task'].currentValue !== changes['task'].previousValue) {
            this.initForm(); 
        }
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
        const currentCategories = this.categories || []; 

        const initialSelectedCategoryObjects = this.task?.categories?.length
            ? currentCategories.filter(cat => this.task!.categories!.includes(cat.id))
            : [];

        this.taskForm = this.fb.group({
            title: [this.task?.title || '', Validators.required],
            description: [this.task?.description || ''],
            dueDate: [this.task?.dueDate || null],
            tags: [this.task?.tags || []],
            categories: [initialSelectedCategoryObjects], 
            subtasks: this.fb.array(
                this.task?.subtasks?.map(s => this.fb.group({
                    title: [s.title],
                    isCompleted: [s.isCompleted]
                })) || []
            ),
            status: [this.task?.status || 'Non Started', Validators.required] 
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
        console.log(`Subtask at index ${index} removed. Current subtasks:`, this.subtasks.value);
    }

  
    trackByFn(index: number, item: any): any {
        return index; 
    }

    saveTask(): void {
        if (this.taskForm.valid) {
            const selectedCategoryObjects: Category[] = this.taskForm.value.categories || []; 
            const selectedCategoryIds = selectedCategoryObjects.map(cat => cat.id);

            const updatedTask: Task = {
                id: this.task?.id || crypto.randomUUID(),
                createdAt: this.task?.createdAt || new Date(),
                updatedAt: new Date(),
                status: this.taskForm.value.status,
                title: this.taskForm.value.title,
                description: this.taskForm.value.description,
                dueDate: this.taskForm.value.dueDate,
                tags: this.taskForm.value.tags || [], 
                subtasks: this.taskForm.value.subtasks,
                categories: selectedCategoryIds,
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