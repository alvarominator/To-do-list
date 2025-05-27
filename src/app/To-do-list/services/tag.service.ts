// src/app/To-do-list/services/tag.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private _tags$ = new BehaviorSubject<string[]>([]);
  public tags$ = this._tags$.asObservable();

  constructor() {
    this.loadTagsFromLocalStorage();
  }

  addTag(tag: string): void {
    const currentTags = this._tags$.value;
    const trimmedTag = tag.trim();

    if (trimmedTag && !currentTags.includes(trimmedTag)) { 
      const newTags = [...currentTags, trimmedTag];
      this._tags$.next(newTags);
      this.saveTagsToLocalStorage(newTags);
    }
 
  }

  removeTag(tag: string): void {
    const currentTags = this._tags$.value;
    const newTags = currentTags.filter((t) => t !== tag);
    this._tags$.next(newTags);
    this.saveTagsToLocalStorage(newTags);
  }

  private saveTagsToLocalStorage(tags: string[]): void {
    try {
      localStorage.setItem('todoTags', JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  }

  private loadTagsFromLocalStorage(): void {
    const savedTags = localStorage.getItem('todoTags');
    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags);
        if (Array.isArray(parsedTags) && parsedTags.every(item => typeof item === 'string')) {
          this._tags$.next(parsedTags);
        } else {
          console.warn('Invalid data found in localStorage for tags.  Clearing.');
          this._tags$.next([]);
          localStorage.removeItem('todoTags');
        }

      } catch (error) {
        console.error('Error parsing tags from localStorage:', error);
        this._tags$.next([]);
        localStorage.removeItem('todoTags');
      }
    } else {
         this._tags$.next([]);
    }
  }

  getTags(): string[] {
    return this._tags$.value;
  }
}
