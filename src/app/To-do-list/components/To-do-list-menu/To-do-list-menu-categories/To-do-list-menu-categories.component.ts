import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'to-do-list-menu-categories',
  imports: [ButtonModule, FormsModule, CommonModule],
  templateUrl: './To-do-list-menu-categories.component.html',
})
export class ToDoListMenuCategoriesComponent implements OnInit, OnDestroy {
  newCategoryName: string = '';
  categories: Category[] = [];
  showAddCategoryInput: boolean = false;
  categoriesSubscription?: Subscription;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  toggleAddCategoryInput(): void {
    this.showAddCategoryInput = !this.showAddCategoryInput;
    this.newCategoryName = ''; // Limpiar el input al mostrar/ocultar
  }

  addNewCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categoryService.addCategory(this.newCategoryName);
      this.newCategoryName = ''; // Limpiar el input después de añadir
      this.showAddCategoryInput = false; // Ocultar el input después de añadir
    }
  }
}