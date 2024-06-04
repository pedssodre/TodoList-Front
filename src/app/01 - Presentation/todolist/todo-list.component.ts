import { TodoListService } from '../../02 - Domain/todo-list/service/todo-list.service';
import { TodoItemStatus, IGetAllTodoItems, TodoItem } from '../../02 - Domain/todo-list/model/model';
import { Component, OnInit, inject, input } from '@angular/core';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { HlmDialogService } from '../../../../components/ui-dialog-helm/src/lib/hlm-dialog.service';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoListSharedService } from '../../02 - Domain/shared/service/todo-list-shared.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
    TableComponent,
    CommonModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodolistComponent implements OnInit {
  private readonly _hlmDialogService = inject(HlmDialogService);
  selectedTab: number | undefined;
  todoItemsList: TodoItem[] = [];

  constructor(
    private todolistService: TodoListService,
    private todoListSharedService: TodoListSharedService
  ){}

  ngOnInit() {
    this.getAllTodoItems();
    this.todoListSharedService.refreshList$.subscribe(({selectedTab}) => {
      this.getAllTodoItems(selectedTab);
    });
  }

  getAllTodoItems(todoItemStatus?: TodoItemStatus) {
    this.selectedTab = todoItemStatus;
    let callApi = new Observable<IGetAllTodoItems | any>();
    callApi = this.todolistService.getTodoItemsList(todoItemStatus || todoItemStatus == 0 ? todoItemStatus : null);
    callApi
      .subscribe(
        {
          next: (response) => {
            this.todoItemsList = response.items;
          }
        })
  }

  public openDynamicComponent() {
    const dialogRef = this._hlmDialogService.open(TodoItemComponent, {
      context: {
          todoItem: null,
          isView: false,
          selectedTab: this.selectedTab
      }
    });
  }
}
