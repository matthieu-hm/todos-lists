import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Todo, TodosListsApiService } from 'src/app/modules/api';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  @Input({ required: true }) todo!: Todo;

  todoForm = this.formBuilder.group({
    isDone: [false],
  });

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private todosListsApiService: TodosListsApiService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.todoForm.patchValue({
      isDone: !!this.todo.doneAt,
    }, { emitEvent: false });
    this.todoForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll),
      )
      .subscribe((value) => {
        if (value.isDone) {
          return this.markTodoAsDone();
        }
        return this.markTodoAsNotDone();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  markTodoAsDone(): void {
    this.todoForm.disable({ emitEvent: false });

    this.todosListsApiService.markTodoAsDone(this.todo.id)
      .subscribe((todo) => {
        this.todo = todo;
        this.todoForm.enable({ emitEvent: false });
      });
  }

  markTodoAsNotDone(): void {
    this.todoForm.disable({ emitEvent: false });

    this.todosListsApiService.markTodoAsNotDone(this.todo.id)
      .subscribe((todo) => {
        this.todo = todo;
        this.todoForm.enable({ emitEvent: false });
      });
  }
}
