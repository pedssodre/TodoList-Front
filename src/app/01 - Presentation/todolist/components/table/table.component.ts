import { TodoListService } from './../../../../02 - Domain/todo-list/service/todo-list.service';
import { HlmDialogService } from './../../../../../../components/ui-dialog-helm/src/lib/hlm-dialog.service';
import { Component, Input, inject } from '@angular/core';
import { HlmCaptionComponent, HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '@spartan-ng/ui-table-helm';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TodoItem } from '../../../../02 - Domain/todo-list/model/model';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '../../../../../../components/ui-button-helm/src/lib/hlm-button.directive';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
    HlmButtonDirective,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  private readonly _hlmDialogService = inject(HlmDialogService);
  @Input() todoItemsList: TodoItem[] = [];
  @Input() selectedTab: Number | undefined;
  faEdit = faEdit;
  faDelete = faTrash

  constructor(
    private todolistService: TodoListService
  ) {}

  public openDynamicComponent(todoItem: TodoItem, isView: boolean) {
    const dialogRef = this._hlmDialogService.open(TodoItemComponent, {
      context: {
          todoItem: todoItem,
          isView: isView,
          selectedTab: this.selectedTab
      }
    });
  }

  removeTodoItem(id: string): void {
    this.todoItemsList = this.todoItemsList.filter(item => item.id !== id);
  }

  onDelete(todoItemId: string)
  {
    let callApi = new Observable< any>();
    callApi = this.todolistService.delete(todoItemId);
    callApi
      .subscribe(
        {
          next: () => {
            this.removeTodoItem(todoItemId);
          },
          error: (err) => {
            console.log(err);
          }
        });
  }
}
