// src/app/To-do-list/components/to-do-list-menu/to-do-list-menu-tags.component.ts
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagService } from '../../../services/tag.service';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
    selector: 'to-do-list-menu-tags',
    standalone: true,
    imports: [
        TagModule,
        InputTextModule,
        FormsModule,
        ButtonModule,
        CommonModule,
        DialogModule,
        ChipModule,
        ConfirmDialogModule
    ],
    templateUrl: './to-do-list-menu-tags.component.html',
    providers: [ConfirmationService]
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
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private taskService: TaskService
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
            this.tagService.addTag(trimmedTagName);
            this.tagAdded.emit(trimmedTagName);
            this.messageService.add({
                severity: 'success',
                summary: 'Tag added',
                detail: `The tag "${trimmedTagName}" has been added.`,
                life: 3000
            });
        } else if (this.existingTags.includes(trimmedTagName)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `The tag "${trimmedTagName}" already exists.`,
                life: 3000
            });
        }
        else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `The name of the tag can't be empty.`,
                life: 3000
            });
        }
        this.displayDialog = false;
        this.newTagName = '';
    }

    removeTag(tagToRemove: string): void {
        // Check if tag is in use
        this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks: Task[]) => {
            const isTagInUse = tasks.some(task =>
                task.tags && task.tags.includes(tagToRemove)
            );

            if (isTagInUse) {
                // If tags in use, show confirmation dialog
                this.confirmationService.confirm({
                    message: `The tag "${tagToRemove}" is assigned to one or more tasks. ¿Are you sure you want to delete it? It will be removed from all tasks where it is assigned.`,
                    header: 'Confirmation of the deletion of a Tag',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        // the user confirmed
                        this.taskService.removeTagFromAllTasks(tagToRemove);
                        this.tagService.removeTag(tagToRemove);
                        this.tagRemoved.emit(tagToRemove);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Tag deleted',
                            detail: `The Tag "${tagToRemove}" and it's references in tasks have been eliminated.`,
                            life: 5000
                        });
                    },
                    reject: () => {
                        // the user canceled
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Canceled',
                            detail: 'The deletion of the tag has been canceled.',
                            life: 3000
                        });
                    }
                });
            } else {
                // If Tag not in use, delete without confirmation
                this.tagService.removeTag(tagToRemove);
                this.tagRemoved.emit(tagToRemove);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Tag deleted',
                    detail: `The Tag "${tagToRemove}" has been eliminated.`,
                    life: 3000
                });
            }
        });
    }
}