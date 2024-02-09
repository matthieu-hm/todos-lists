import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, Repository } from 'typeorm';
import { pick } from 'lodash';
import { List, User } from '../entities';
import {
  ListDeletedException,
  ListForbiddenException,
  ListNotDeletedException,
  ListNotFoundException,
} from '../exceptions';
import { BaseEntitiesService } from './core';

@Injectable()
export class ListsService extends BaseEntitiesService<List> {
  constructor(
    @InjectRepository(List) repository: Repository<List>,
  ) {
    super(ListsService.name, repository);
  }

  async checkOwnership(listId: string, user: User): Promise<void> {
    this.logger.verbose('checkOwnership()');

    const count = await this.repository.count({ where: { id: listId, userId: user.id } });
    if (!count) {
      this.throwForbiddenException('List does not belong to the user');
    }
  }

  async findManyByUser(
    userId: string,
    relations: FindOptionsRelations<List> = {},
    withDeleted = false,
  ): Promise<List[]> {
    this.logger.verbose('findManyByUser()');

    const findOptions: FindManyOptions<List> = {
      where: { userId },
      relations,
      withDeleted,
      order: { createdAt: 'DESC' },
    };

    return this.repository.find(findOptions);
  }

  async create(listData: Partial<List>, user: User): Promise<List> {
    this.logger.verbose('create()');

    const allowedProperties = [
      'title',
    ];
    const allowedData = pick(listData, allowedProperties);

    const todo = await this._create({
      ...allowedData,
      userId: user.id,
    });

    todo.user = user;
    return todo;
  }

  async update(listId: string, updateData: Partial<List>): Promise<List> {
    this.logger.verbose('update()');

    const allowedProperties = [
      'title',
    ];

    const allowedData = pick(updateData, allowedProperties);

    return this._update(listId, allowedData);
  }

  protected override throwDeletedException(): never {
    this.logger.verbose('throwDeletedException()');

    throw new ListDeletedException();
  }

  protected override throwNotDeletedException(): never {
    this.logger.verbose('throwNotDeletedException()');

    throw new ListNotDeletedException();
  }

  protected override throwNotFoundException(): never {
    this.logger.verbose('throwNotFoundException()');

    throw new ListNotFoundException();
  }

  protected override throwForbiddenException(message?: string): never {
    this.logger.verbose('throwForbiddenException()');

    throw new ListForbiddenException(message);
  }
}
