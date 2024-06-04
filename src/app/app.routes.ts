import { Routes } from '@angular/router';
import { TodolistComponent } from './01 - Presentation/todolist/todo-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todolist',
    pathMatch: 'full'
  },
  {
    path: 'todolist',
    component: TodolistComponent
  },
  {
    path: '**',
    redirectTo: 'todolist'
  }
];
