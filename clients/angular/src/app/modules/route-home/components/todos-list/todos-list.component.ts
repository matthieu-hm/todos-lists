import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { List, TodosListsApiService } from 'src/app/modules/api';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
})
export class TodosListComponent {
  @Input({ required: true }) list!: List;

  todoForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private todosListsApiService: TodosListsApiService,
    private formBuilder: FormBuilder,
  ) {}

  addTodo(): void {
    if (this.todoForm.invalid) {
      return;
    }

    this.todoForm.disable();

    this.todosListsApiService.createTodo(this.list.id, this.todoForm.value.title!)
      .subscribe((todo) => {
        this.list.todos.push(todo);

        this.todoForm.reset({ title: '' });
        this.todoForm.enable();
      });
  }
}
