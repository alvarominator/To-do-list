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
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Subscription } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ToDoListMenuTagsComponent } from '../To-do-list-menu/To-do-list-menu-tags/To-do-list-menu-tags.component';

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
        ToDoListMenuTagsComponent
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
    tags: string[] = [];

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private router: Router,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.categoriesSubscription = this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
            this.initForm();
        });
    }

    ngOnChanges(): void {
        this.initForm();
        this.tags = this.task?.tags || [];
    }

    ngOnDestroy(): void {
        if (this.categoriesSubscription) {
            this.categoriesSubscription.unsubscribe();
        }
    }

    initForm(): void {
        const categoryControls = this.categories.map(category => {
            const isCategorySelected = this.task?.categories?.includes(category.id) || false;
            return new FormControl(isCategorySelected);
        });

        this.taskForm = this.fb.group({
            title: [this.task?.title || '', Validators.required],
            description: [this.task?.description || ''],
            dueDate: [this.task?.dueDate || null],
            tags: [this.task?.tags || []],
            categories: this.fb.array(categoryControls),
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

    get categoriesArray(): FormArray {
        return this.taskForm.get('categories') as FormArray;
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

    onCategoryCheckboxChange(categoryId: string, checked: boolean, index: number): void {
        const categoriesFormArray = this.taskForm.get('categories') as FormArray;
        categoriesFormArray.at(index).setValue(checked);
    }

    handleTagAdded(newTag: string) {
        this.tags.push(newTag);
        this.taskForm.get('tags')?.setValue(this.tags);
    }

    handleTagRemoved(tagToRemove: string) {
        this.tags = this.tags.filter(tag => tag !== tagToRemove);
        this.taskForm.get('tags')?.setValue(this.tags);
    }

    saveTask(): void {
        if (this.taskForm.valid) {
            const selectedCategories = this.categoriesArray.value
                .map((checked: boolean, index: number): string | null => {
                    return checked ? this.categories[index]?.id : null;
                })
                .filter((id: string | null): id is string => id !== null);

            const updatedTask: Task = {
                id: this.task?.id || crypto.randomUUID(),
                createdAt: this.task?.createdAt || new Date(),
                updatedAt: new Date(),
                status: this.taskForm.value.status || 'Non Started',
                title: this.taskForm.value.title,
                description: this.taskForm.value.description,
                dueDate: this.taskForm.value.dueDate,
                tags: this.tags,
                subtasks: this.taskForm.value.subtasks,
                categories: selectedCategories
            };
            this.taskService.updateTask(updatedTask);
            this.closed.emit(updatedTask);
        }
    }
    clearCategory(): void {
        this.selectedCategory = null;
        this.taskForm.get('category')!.setValue(null);
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