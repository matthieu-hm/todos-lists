import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pick } from 'lodash';
import { List, Todo } from '../entities';
import {
  TodoDeletedException,
  TodoForbiddenException,
  TodoNotDeletedException,
  TodoNotFoundException,
} from '../exceptions';
import { BaseEntitiesService } from './core';

@Injectable()
export class TodosService extends BaseEntitiesService<Todo> {
  constructor(
    @InjectRepository(Todo) repository: Repository<Todo>,
  ) {
    super(TodosService.name, repository);
  }

  async create(todoData: Partial<Todo>, list: List): Promise<Todo> {
    this.logger.verbose('create()');

    const allowedProperties = [
      'title',
    ];
    const allowedData = pick(todoData, allowedProperties);

    const todo = await this._create({
      ...allowedData,
      listId: list.id,
    });

    todo.list = list;
    return todo;
  }

  async update(todoId: string, updateData: Partial<Todo>): Promise<Todo> {
    this.logger.verbose('update()');

    const allowedProperties = [
      'title',
    ];

    const allowedData = pick(updateData, allowedProperties);

    return this._update(todoId, allowedData);
  }

  async markAsDone(todoId: string): Promise<Todo> {
    this.logger.verbose('markAsDone()');

    return this._update(todoId, { doneAt: new Date() });
  }

  async markAsNotDone(todoId: string): Promise<Todo> {
    this.logger.verbose('markAsNotDone()');

    return this._update(todoId, { doneAt: null });
  }

  protected override throwDeletedException(): never {
    this.logger.verbose('throwDeletedException()');

    throw new TodoDeletedException();
  }

  protected override throwNotDeletedException(): never {
    this.logger.verbose('throwNotDeletedException()');

    throw new TodoNotDeletedException();
  }

  protected override throwNotFoundException(): never {
    this.logger.verbose('throwNotFoundException()');

    throw new TodoNotFoundException();
  }

  protected override throwForbiddenException(message?: string): never {
    this.logger.verbose('throwForbiddenException()');

    throw new TodoForbiddenException(message);
  }
}
