import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as sha256 from 'crypto-js/sha256';
import {
  FindOneOptions, FindOptionsRelations, FindOptionsSelect, Repository,
} from 'typeorm';
import { pick } from 'lodash';
import { v4 as uuid } from 'uuid';
import { LocalOAuthProvidersEnum, OAuthProviders } from '@app/shared';
import { IAuthConfig } from '@app/configuration';
import { User } from '../entities';
import {
  UserAlreadyExistException,
  UserDeletedException,
  UserForbiddenException,
  UserNotDeletedException,
  UserNotFoundException,
} from '../exceptions';
import { BaseEntitiesService } from './core';

@Injectable()
export class UsersService extends BaseEntitiesService<User> {
  private authConfig = this.configService.getOrThrow<IAuthConfig>('auth');

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) repository: Repository<User>,
  ) {
    super(UsersService.name, repository);
  }

  async existByEmail(
    email: string,
    withDeleted = false,
    oAuthProvider: OAuthProviders = LocalOAuthProvidersEnum.LOCAL,
  ): Promise<boolean> {
    this.logger.verbose('existByEmail()');

    // Fix: where options does not support generic entity type
    const opt: FindOneOptions<User> = { where: { email, oAuthProvider } } as any;

    if (withDeleted) {
      opt.withDeleted = withDeleted;
    }

    return !!(await this.repository.count(opt));
  }

  async verifyPassword(email: string, password: string): Promise<string> {
    this.logger.verbose('verifyPassword()');

    // Fix: where options does not support generic entity type
    const opt: FindOneOptions<User> = {
      where: { email, oAuthProvider: LocalOAuthProvidersEnum.LOCAL },
      select: ['id', 'email', 'password'],
    } as any;

    const entity = await this.repository.findOne(opt);

    if (!entity) {
      return this.throwNotFoundException();
    }

    const hashedPassword = await this.hashPassword(password, email);

    if (entity.password !== hashedPassword) {
      return this.throwNotFoundException();
    }

    return entity.id;
  }

  async findOneByEmail(
    email: string,
    withDeleted = false,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    this.logger.verbose('findOneByEmail()');

    const opt: FindOneOptions<User> = { where: { email } } as any;

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

  async findOneOrCreateForOAuthProvider(
    oAuthProvider: OAuthProviders,
    oAuthId: string,
    userData: Partial<User>,
  ): Promise<User> {
    this.logger.verbose('findOneOrCreateForOAuthProvider()');
    const user = await this.repository.findOne({ where: { oAuthProvider, oAuthId } });

    if (user) {
      return this.update(user, userData);
    }

    return this.create({
      ...userData,
      oAuthProvider,
      oAuthId,
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.verbose('create()');

    const allowedProperties = [
      'oAuthProvider',
      'oAuthId',
      'password',
      'firstName',
      'lastName',
      'preferredUsername',
      'email',
      'phoneNumber',
    ];
    const allowedData = pick(userData, allowedProperties);

    if (!allowedData.oAuthProvider) {
      allowedData.oAuthProvider = LocalOAuthProvidersEnum.LOCAL;
    }

    if (allowedData.oAuthProvider === LocalOAuthProvidersEnum.LOCAL) {
      // Property oauthId can't be null and must be unique
      allowedData.oAuthId = uuid();

      if (!allowedData.password) {
        throw new Error('Local user creation require a password');
      }
      if (!allowedData.email) {
        throw new Error('Local user creation require an email');
      }

      allowedData.password = await this.hashPassword(allowedData.password, allowedData.email);
    }
    if (allowedData.oAuthProvider !== LocalOAuthProvidersEnum.LOCAL) {
      if (allowedData.password) {
        throw new Error('Provided user creation can\'t have a password');
      }
    }

    const user = this.repository.create(allowedData);
    await this.repository.save(user);

    return user;
  }

  private async update(user: User, updateData: Partial<User>): Promise<User> {
    this.logger.verbose('update()');

    const allowedProperties = [
      'firstName',
      'lastName',
      'phoneNumber',
    ];

    if (user.oAuthProvider !== 'local') {
      allowedProperties.push(
        'preferredUsername',
        'email',
      );
    }

    const allowedData = pick(updateData, allowedProperties);

    return this._update(user.id, allowedData);
  }

  private async hashPassword(password: string, email: string): Promise<string> {
    this.logger.verbose('hashPassword()');

    return sha256(`${password}-${email}-${this.authConfig.passwordSalt}`).toString();
  }

  private throwAlreadyExistException(): never {
    this.logger.verbose('throwAlreadyExistException()');

    throw new UserAlreadyExistException();
  }

  protected override throwDeletedException(): never {
    this.logger.verbose('throwDeletedException()');

    throw new UserDeletedException();
  }

  protected override throwNotDeletedException(): never {
    this.logger.verbose('throwNotDeletedException()');

    throw new UserNotDeletedException();
  }

  protected override throwNotFoundException(): never {
    this.logger.verbose('throwNotFoundException()');

    throw new UserNotFoundException();
  }

  protected override throwForbiddenException(message?: string): never {
    this.logger.verbose('throwForbiddenException()');

    throw new UserForbiddenException(message);
  }
}
