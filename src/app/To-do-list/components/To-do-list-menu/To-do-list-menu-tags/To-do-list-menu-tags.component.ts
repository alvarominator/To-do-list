import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { MessageService } from 'primeng/api';
import { TagService } from '../../../services/tag.service';

@Component({
    selector: 'to-do-list-menu-tags',
    imports: [TagModule, InputTextModule, FormsModule, ButtonModule, CommonModule, DialogModule, ChipModule],
    templateUrl: './to-do-list-menu-tags.component.html',
    providers: [MessageService]
})
export class ToDoListMenuTagsComponent implements OnInit, OnDestroy {
    @Output() tagAdded = new EventEmitter<string>();
    @Output() tagRemoved = new EventEmitter<string>();
    existingTags: string[] = [];
    newTagName: string = '';
    displayDialog: boolean = false;
    private destroy$ = new Subject<void>();

    constructor(
        private tagService: TagService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.tagService.tags$.pipe(takeUntil(this.destroy$)).subscribe(tags => {
            this.existingTags = tags;
        });
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
        const trimmedTagName = this.newTagName.trim();
        if (trimmedTagName && !this.existingTags.includes(trimmedTagName)) {
            this.tagService.addTag(trimmedTagName); // Llama al servicio para añadir la tag
            this.tagAdded.emit(trimmedTagName);
            this.messageService.add({
                severity: 'success',
                summary: 'Tag Añadida',
                detail: `La tag "${trimmedTagName}" ha sido añadida.`,
                life: 3000
            });
        } else if (this.existingTags.includes(trimmedTagName)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `La tag "${trimmedTagName}" ya existe.`,
                life: 3000
            });
        }
        else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `El nombre de la tag no puede estar vacío.`,
                life: 3000
            });
        }
        this.displayDialog = false;
        this.newTagName = '';
    }

    removeTag(tagToRemove: string): void {
        this.tagService.removeTag(tagToRemove);
        this.tagRemoved.emit(tagToRemove);
        this.messageService.add({
            severity: 'warn',
            summary: 'Tag Eliminada',
            detail: `La tag "${tagToRemove}" ha sido eliminada.`,
            life: 3000
        });
    }
}

