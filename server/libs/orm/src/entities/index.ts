import { AuthToken } from './auth-token.entity';
import { List } from './list.entity';
import { Todo } from './todo.entity';
import { User } from './user.entity';

export * from './auth-token.entity';
export * from './list.entity';
export * from './todo.entity';
export * from './user.entity';

export const entities = [
  AuthToken,
  List,
  Todo,
  User,
];
