import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { CommonBaseEntity } from './core';
import { List } from './list.entity';

@Entity('todos')
export class Todo extends CommonBaseEntity {
  // Properties
  // ----------

  @Column()
  title: string;

  @Column({ nullable: true })
  doneAt?: Date;

  // Relations
  // ----------

  @ManyToOne(
    () => List,
    (list) => list.todos,
  )
  list: List;

  @Column()
  listId: string;
}
