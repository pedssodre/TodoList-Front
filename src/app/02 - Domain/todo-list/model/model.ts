export interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  todoItemStatus: TodoItemStatus;
}

export enum TodoItemStatus {
  Pending,
  Completed,
  Overdue
}

export interface TodoList {
  TodoList: TodoItem[]
}
export interface IGetAllTodoItems extends TodoList {}

export interface ICreateTodoItemRequest extends TodoItem{}
export interface ICreateTodoItemResponse extends TodoItem{}

export interface IUpdateTodoitemRequest extends TodoItem{}
export interface IUpdateTodoitemResponse extends TodoItem{}

export interface IDeleteTodoItemResponse {}

