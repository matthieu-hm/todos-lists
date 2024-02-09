import { List } from './list.model';

export class Todo {
  id!: string;

  title!: string;

  doneAt?: string;

  listId!: string;

  list?: List;

  createdAt!: string;

  updatedAt!: string;

  constructor(userData: Partial<Todo>) {
    Object.assign(this, userData);

    if (userData.list) {
      this.list = new List(userData.list);
    }
  }
}
