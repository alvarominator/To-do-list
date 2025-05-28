//src/app/To-do-list/components/To-do-list-menu/To-do-list-menu-categories/to-do-list-menu-categories.component.ts
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';


@Component({
    selector: 'to-do-list-menu-categories',
    standalone: true,
    imports: [InputTextModule, FormsModule, ButtonModule, CommonModule, DialogModule, ConfirmDialogModule],
    templateUrl: 'to-do-list-menu-categories.component.html',
    styleUrls: ['./To-do-list-menu-categories.component.css'],
    providers: [ConfirmationService]
})
export class ToDoListMenuCategoriesComponent implements OnInit, OnDestroy {
    @Output() categoryAdded = new EventEmitter<string>();
    @Output() categoryRemoved = new EventEmitter<string>();
    existingCategories: Category[] = [];
    newCategoryName: string = '';
    displayDialog: boolean = false;
    private destroy$ = new Subject<void>();

    constructor(
        private categoryService: CategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private taskService: TaskService
    ) { }

    ngOnInit(): void {
        this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(categories => {
            this.existingCategories = categories;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showAddDialog(): void {
        this.newCategoryName = '';
        this.displayDialog = true;
    }

    addCategory(): void {
        const trimmedCategoryName = this.newCategoryName.trim();
        if (trimmedCategoryName && !this.existingCategories.some(cat => cat.name === trimmedCategoryName)) {
            this.categoryService.addCategory(trimmedCategoryName);
            this.categoryAdded.emit(trimmedCategoryName);
            this.messageService.add({
                severity: 'success',
                summary: 'Category Added',
                detail: `The Category "${trimmedCategoryName}" Has been added.`,
                life: 3000
            });
        } else if (this.existingCategories.some(cat => cat.name === trimmedCategoryName)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `The Category "${trimmedCategoryName}" Already exists.`,
                life: 3000
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `The name of the category can't be empty.`,
                life: 3000
            });
        }
        this.displayDialog = false;
        this.newCategoryName = '';
    }
    removeCategory(categoryToRemove: Category): void {
        // Check if category is in use
        this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks: Task[]) => {
            const isCategoryInUse = tasks.some(task => 
                task.categories && task.categories.includes(categoryToRemove.id)
            );

            if (isCategoryInUse) {
                // if in use, use dialog
                this.confirmationService.confirm({
                    message: `The category "${categoryToRemove.name}" is assigned to one or more tasks. ¿Are you sure you want to delete it? It will be removed from all tasks where it is assigned.`,
                    header: 'Confirmation of the deletion of a Category',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        // The user has confirmed
                        this.taskService.removeCategoryFromAllTasks(categoryToRemove.id);
                        this.categoryService.deleteCategory(categoryToRemove.id);
                        this.categoryRemoved.emit(categoryToRemove.name);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Category Deleted',
                            detail: `The Category "${categoryToRemove.name}" and it's references in tasks have been eliminated`,
                            life: 5000
                        });
                    },
                    reject: () => {
                        // The user canceled
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Canceled',
                            detail: 'The deletion of the category has been canceled.',
                            life: 3000
                        });
                    }
                });
            } else {
                // If category not in use, delete without confirmation
                this.categoryService.deleteCategory(categoryToRemove.id);
                this.categoryRemoved.emit(categoryToRemove.name);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Category Deleted',
                    detail: `The category "${categoryToRemove.name}" has been eliminated.`,
                    life: 3000
                });
            }
        });
    }
}