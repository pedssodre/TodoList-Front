import { Injectable, Injector } from '@angular/core';
import { ICreateTodoItemRequest, IDeleteTodoItemResponse, IGetAllTodoItems, IUpdateTodoitemRequest, IUpdateTodoitemResponse, TodoItemStatus } from '../model/model';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  protected httpClient: HttpClient;

  constructor(
    private injector: Injector
  ) {
    this.httpClient = this.injector.get<HttpClient>(HttpClient);
  }

  protected extractData(response: any): any {
    return response || {};
  }

  getHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getTodoItemsList(todoItemStatus: TodoItemStatus | null): Observable<IGetAllTodoItems> {
    const statusKey = todoItemStatus || todoItemStatus == 0  ? TodoItemStatus[todoItemStatus] : '';
    const queryParam = statusKey ? `?TodoItemStatus=${statusKey}` : '';
    return this
      .httpClient
      .get<IGetAllTodoItems>(`http://localhost:5036/api/Todo${queryParam}`, { headers: this.getHeaders() })
      .pipe(
        map(this.extractData)
      );
  }

  create(todoItem: ICreateTodoItemRequest): Observable<ICreateTodoItemRequest> {
    return this
      .httpClient.post('http://localhost:5036/api/Todo', JSON.stringify(todoItem), { headers: this.getHeaders() })
      .pipe(
        map(this.extractData)
      );
  }

  update(todoItem: IUpdateTodoitemRequest): Observable<IUpdateTodoitemResponse> {
    return this
      .httpClient.put('http://localhost:5036/api/Todo', JSON.stringify(todoItem), { headers: this.getHeaders() })
      .pipe(
        map(this.extractData)
      );
  }

  delete(todoItemId: string): Observable<IDeleteTodoItemResponse> {
    return this
      .httpClient.delete(`http://localhost:5036/api/Todo?id=${todoItemId}`, { headers: this.getHeaders() })
      .pipe(
        map(this.extractData)
      );
  }
}

