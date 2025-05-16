// src/app/To-do-list/components/to-do-list-menu-tags/to-do-list-menu-tags.component.ts
import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'to-do-list-menu-tags',
    imports: [TagModule, InputTextModule, FormsModule, ButtonModule, CommonModule, DialogModule, ChipModule],
    templateUrl: './to-do-list-menu-tags.component.html',
})
export class ToDoListMenuTagsComponent implements OnInit, OnDestroy {
    @Output() tagAdded = new EventEmitter<string>();
    @Output() tagRemoved = new EventEmitter<string>();
    @Input() existingTags: string[] = [];
    newTagName: string = '';
    displayDialog: boolean = false;
    tagsCreated: string[] = [];
    private destroy$ = new Subject<void>();

    constructor() { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showAddDialog(): void {
        this.newTagName = '';
        this.displayDialog = true;
    }

    addTag(): void {
        if (this.newTagName.replace(" ", "") && !this.tagsCreated.includes(this.newTagName.trim())) {
            this.tagsCreated.push(this.newTagName);
        }
        this.displayDialog = false;
        this.newTagName = '';
    }

    removeTag(tagToRemove: string): void {
        this.tagRemoved.emit(tagToRemove);
    }
}
