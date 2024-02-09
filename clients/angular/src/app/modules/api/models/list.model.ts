import { sortBy } from 'lodash-es';
import { Todo } from './todo.model';
import { User } from './user.model';

export class List {
  id!: string;

  title!: string;

  todos!: Todo[];

  userId!: string;

  user?: User;

  createdAt!: string;

  updatedAt!: string;

  constructor(listData: Partial<List>) {
    Object.assign(this, listData);

    if (listData.todos) {
      const sortedTodos = sortBy(listData.todos, ['createdAt', 'id']);
      this.todos = sortedTodos.map((todo) => new Todo(todo));
    }

    if (listData.user) {
      this.user = new User(listData.user);
    }
  }
}
