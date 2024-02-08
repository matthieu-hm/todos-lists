import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonBaseEntity } from './core';
import { Todo } from './todo.entity';
import { User } from './user.entity';

@Entity('lists')
export class List extends CommonBaseEntity {
  // Properties
  // ----------

  @Column()
  title: string;

  // Relations
  // ----------

  @OneToMany(
    () => Todo,
    (todo) => todo.list,
  )
  todos?: Todo[];

  @ManyToOne(
    () => User,
    (user) => user.lists,
  )
  user: User;

  @Column()
  userId: string;
}
