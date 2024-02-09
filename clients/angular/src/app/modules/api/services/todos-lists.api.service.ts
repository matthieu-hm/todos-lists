import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  map, Observable,
} from 'rxjs';
import { Environment } from 'src/app/modules/env';
import { List, Todo } from '../models';

@Injectable()
export class TodosListsApiService {
  constructor(
    private environment: Environment,
    private httpClient: HttpClient,
  ) {}

  createList(title: string): Observable<List> {
    return this.httpClient
      .post<List>(`${this.environment.apiUrl}lists`, { title })
      .pipe(
        map((listData) => new List(listData)),
      );
  }

  updateList(listId: string, title: string): Observable<List> {
    return this.httpClient
      .put<List>(`${this.environment.apiUrl}lists/${listId}`, { title })
      .pipe(
        map((listData) => new List(listData)),
      );
  }

  createTodo(listId: string, title: string): Observable<Todo> {
    return this.httpClient
      .post<Todo>(`${this.environment.apiUrl}lists/${listId}/todo`, { title })
      .pipe(
        map((todoData) => new Todo(todoData)),
      );
  }

  updateTodo(todoId: string, title: string): Observable<Todo> {
    return this.httpClient
      .put<Todo>(`${this.environment.apiUrl}todos/${todoId}`, { title })
      .pipe(
        map((todoData) => new Todo(todoData)),
      );
  }

  markTodoAsDone(todoId: string): Observable<Todo> {
    return this.httpClient
      .put<Todo>(`${this.environment.apiUrl}todos/${todoId}/done`, {})
      .pipe(
        map((todoData) => new Todo(todoData)),
      );
  }

  markTodoAsNotDone(todoId: string): Observable<Todo> {
    return this.httpClient
      .put<Todo>(`${this.environment.apiUrl}todos/${todoId}/not-done`, {})
      .pipe(
        map((todoData) => new Todo(todoData)),
      );
  }
}
