//src/app/To-do-list/components/To-do-list-menu/To-do-list-menu-categories/to-do-list-menu-categories.component.ts
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
    selector: 'to-do-list-menu-categories',
    imports: [InputTextModule, FormsModule, ButtonModule, CommonModule, DialogModule],
    templateUrl: 'to-do-list-menu-categories.component.html',
    styleUrls: ['./To-do-list-menu-categories.component.css'],
    providers: [MessageService]
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
        private messageService: MessageService
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
                summary: 'Categoría Añadida',
                detail: `La categoría "${trimmedCategoryName}" ha sido añadida.`,
                life: 3000
            });
            this.loadCategories();
        } else if (this.existingCategories.some(cat => cat.name === trimmedCategoryName)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `La categoría "${trimmedCategoryName}" ya existe.`,
                life: 3000
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `El nombre de la categoría no puede estar vacío.`,
                life: 3000
            });
        }
        this.displayDialog = false;
        this.newCategoryName = '';
    }

    removeCategory(categoryToRemove: Category): void {
        this.categoryService.deleteCategory(categoryToRemove.id);
        this.categoryRemoved.emit(categoryToRemove.name);
        this.messageService.add({
            severity: 'warn',
            summary: 'Categoría Eliminada',
            detail: `La categoría "${categoryToRemove.name}" ha sido eliminada.`,
            life: 3000
        });
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.destroy$))
            .subscribe((categories) => {
                this.existingCategories = categories;
            });
    }
}