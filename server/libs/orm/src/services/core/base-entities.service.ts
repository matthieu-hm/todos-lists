import { Injectable, Logger } from '@nestjs/common';
import * as isUUID from 'is-uuid';
import { forIn, omit } from 'lodash';
import {
  DeepPartial, FindOneOptions, FindOptionsRelations, FindOptionsSelect, Repository,
} from 'typeorm';
import { CommonBaseEntity } from '../../entities/core';
import {
  EntityDeletedException, EntityForbiddenException, EntityNotDeletedException, EntityNotFoundException,
} from '../../exceptions';

@Injectable()
export abstract class BaseEntitiesService<T extends CommonBaseEntity> {
  protected logger: Logger;

  constructor(
    loggerContext: string,
    protected repository: Repository<T>,
  ) {
    this.logger = new Logger(loggerContext);
  }

  async exist(id: string, withDeleted = false): Promise<boolean> {
    this.logger.verbose('exist()');

    if (!isUUID.v4(id)) {
      return false;
    }

    // Fix: where options does not support generic entity type
    const opt: FindOneOptions<T> = { where: { id } } as any;

    if (withDeleted) {
      opt.withDeleted = withDeleted;
    }

    return !!(await this.repository.count(opt));
  }

  async findOneById(
    id: string,
    withDeleted = false,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<T> {
    this.logger.verbose('findOneById()');

    if (!isUUID.v4(id)) {
      this.throwNotFoundException();
    }

    // Fix: where options does not support generic entity type
    const opt: FindOneOptions<T> = { where: { id } } as any;

    if (withDeleted) {
      opt.withDeleted = withDeleted;
    }

    if (relations) {
      opt.relations = relations;
    }

    if (select) {
      opt.select = select;
    }

    const entity = await this.repository.findOne(opt);

    if (!entity) {
      this.throwNotFoundException();
    }

    return entity;
  }

  protected async _create(createData: Omit<Partial<T>, 'id' | 'createAt' | 'updatedAt' | 'deletedAt'>): Promise<T> {
    this.logger.verbose('_create()');

    const forbiddenProperties = [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      ...this.getOneToManyRelationsPropertyNames(),
    ];

    const allowedData: DeepPartial<T> = omit(createData, forbiddenProperties) as any;

    const entity = this.repository.create(allowedData);

    return this.repository.save(entity);
  }

  protected async _update(id: string, updateData: Omit<Partial<T>, 'id' | 'createAt' | 'updatedAt' | 'deletedAt'>): Promise<T> {
    this.logger.verbose('_update()');

    const entityFound = await this.findOneById(id, true);

    if (entityFound.deletedAt) {
      this.throwDeletedException();
    }

    const forbiddenProperties = [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      ...this.getOneToManyRelationsPropertyNames(),
    ];

    const allowedData: Partial<T> = omit(updateData, forbiddenProperties) as any;

    if (!Object.keys(allowedData).length) {
      // Avoid useless update query
      return entityFound;
    }

    forIn(allowedData, (value, key) => {
      entityFound[key] = value;
    });

    return this.repository.save(entityFound);
  }

  protected async _softDelete(id: string): Promise<T> {
    this.logger.verbose('_softDelete()');

    const entity = await this.findOneById(id, true);

    if (entity.deletedAt) {
      this.throwDeletedException();
    }

    const now = new Date();
    /* eslint-disable no-param-reassign */
    entity.deletedAt = now;
    /* eslint-enable no-param-reassign */

    return this.repository.save(entity);
  }

  protected async _restore(id: string): Promise<T> {
    this.logger.verbose('_restore()');

    const entity = await this.findOneById(id, true);

    if (!entity.deletedAt) {
      this.throwNotDeletedException();
    }

    /* eslint-disable no-param-reassign */
    entity.deletedAt = null;
    /* eslint-enable no-param-reassign */

    return this.repository.save(entity);
  }

  protected getOneToManyRelationsPropertyNames(): string[] {
    this.logger.verbose('getOneToManyRelationsPropertyNames()');

    return this.repository.metadata.oneToManyRelations.map((relation) => relation.propertyName);
  }

  protected throwDeletedException(): never {
    this.logger.verbose('throwDeletedException()');

    throw new EntityDeletedException();
  }

  protected throwNotDeletedException(): never {
    this.logger.verbose('throwNotDeletedException()');

    throw new EntityNotDeletedException();
  }

  protected throwNotFoundException(): never {
    this.logger.verbose('throwNotFoundException()');

    throw new EntityNotFoundException();
  }

  protected throwForbiddenException(message?: string): never {
    this.logger.verbose('throwForbiddenException()');

    throw new EntityForbiddenException(message);
  }
}
