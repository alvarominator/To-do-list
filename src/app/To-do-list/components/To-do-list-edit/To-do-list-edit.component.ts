import {Component } from '@angular/core';
import { ButtonModule, ButtonStyle } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'to-do-list-edit',
  imports: [TagModule, ButtonModule],
  templateUrl: './To-do-list-edit.component.html',
})
export class ToDoListEditComponent { }
