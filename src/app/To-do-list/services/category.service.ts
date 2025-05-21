// category.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  private categories: Category[] = [];

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
      this.categoriesSubject.next([...this.categories]);
    }
  }

  private saveCategories(): void {
    localStorage.setItem('categories', JSON.stringify(this.categories));
    this.categoriesSubject.next([...this.categories]);
  }

  addCategory(name: string): void {
    const newCategory: Category = { id: uuidv4(), name };
    this.categories.push(newCategory);
    this.saveCategories();
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

    deleteCategory(id: string): void {
        this.categories = this.categories.filter(category => category.id !== id);
        this.saveCategories();
    }


  getCategoryById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }
}
