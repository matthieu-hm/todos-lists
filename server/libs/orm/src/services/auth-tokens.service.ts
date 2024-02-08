import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as isUUID from 'is-uuid';
import { v4 as uuid } from 'uuid';
import { UAParser } from 'ua-parser-js';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { IAuthConfig } from '@app/configuration';
import { AuthToken, User } from '../entities';
import { AuthTokenDeletedException, AuthTokenNotFoundException } from '../exceptions';
import { BaseEntitiesService } from './core';

@Injectable()
export class AuthTokensService extends BaseEntitiesService<AuthToken> {
  private authConfig = this.configService.getOrThrow<IAuthConfig>('auth');

  constructor(
    private configService: ConfigService,
    @InjectRepository(AuthToken) repository: Repository<AuthToken>,
  ) {
    super(AuthTokensService.name, repository);
  }

  async findOneByAccessToken(accessToken: string, withDeleted = false, withUserRelation = false): Promise<AuthToken> {
    this.logger.verbose('findOneByAccessToken()');

    if (!isUUID.v4(accessToken)) {
      this.throwNotFoundException();
    }

    const findOptions: FindOneOptions<AuthToken> = {
      where: { accessToken },
      withDeleted,
    };

    if (withUserRelation) {
      findOptions.relations = ['user'];
    }

    const authToken = await this.repository.findOne(findOptions);

    if (!authToken) {
      this.throwNotFoundException();
    }

    return authToken;
  }

  async findOneByRefreshToken(refreshToken: string, withDeleted = false, withUserRelation = false): Promise<AuthToken> {
    this.logger.verbose('findOneByRefreshToken()');

    if (!isUUID.v4(refreshToken)) {
      this.throwNotFoundException();
    }

    const findOptions: FindOneOptions<AuthToken> = {
      where: { refreshToken },
      withDeleted,
    };

    if (withUserRelation) {
      findOptions.relations = ['user'];
    }

    const authToken = await this.repository.findOne(findOptions);

    if (!authToken) {
      this.throwNotFoundException();
    }

    return authToken;
  }

  async findManyByUser(user: User, withDeleted = false): Promise<AuthToken[]> {
    this.logger.verbose('findManyByUser()');

    const findOptions: FindManyOptions<AuthToken> = {
      where: { userId: user.id },
      withDeleted,
    };

    return this.repository.find(findOptions);
  }

  async create(userId: string, remember: boolean, ip: string, userAgent: string): Promise<AuthToken> {
    this.logger.verbose('create()');

    const uaParser = new UAParser();
    uaParser.setUA(userAgent);

    return this._create({
      userId,
      remember,
      accessToken: uuid(),
      accessTokenExpiredAt: this.getAccessTokenExpiredAt(),
      refreshToken: uuid(),
      refreshTokenExpiredAt: this.getRefreshTokenExpiredAt(remember),
      ip,
      os: uaParser.getOS().name,
      browser: uaParser.getBrowser().name,
    });
  }

  async updateLastUsedAt(authToken: AuthToken): Promise<AuthToken> {
    this.logger.verbose('updateLastUsedAt()');

    return this._update(
      authToken.id,
      {
        lastUsedAt: new Date(),
      },
    );
  }

  async refresh(authToken: AuthToken): Promise<AuthToken> {
    this.logger.verbose('refresh()');

    return this._update(
      authToken.id,
      {
        accessToken: uuid(),
        accessTokenExpiredAt: this.getAccessTokenExpiredAt(),
        refreshToken: uuid(),
        refreshTokenExpiredAt: this.getRefreshTokenExpiredAt(authToken.remember),
        lastUsedAt: new Date(),
      },
    );
  }

  async softDelete(id: string): Promise<AuthToken> {
    this.logger.verbose('softDelete()');

    const authToken = await this.findOneById(id, true);

    if (authToken.deletedAt) {
      this.throwDeletedException();
    }

    const now = new Date();
    authToken.deletedAt = now;
    authToken.accessToken = `${now.getTime()}_${authToken.accessToken}`;
    authToken.refreshToken = `${now.getTime()}_${authToken.refreshToken}`;

    return this.repository.save(authToken);
  }

  private getAccessTokenExpiredAt(): Date {
    this.logger.verbose('getAccessTokenExpiredAt()');

    const accessTokenExpiredAt = new Date();

    accessTokenExpiredAt.setTime(accessTokenExpiredAt.getTime() + (this.authConfig.accessTokenTtl * 1000));
    return accessTokenExpiredAt;
  }

  private getRefreshTokenExpiredAt(remember: boolean): Date {
    this.logger.verbose('getRefreshTokenExpiredAt()');

    const refreshTokenExpiredAt = new Date();

    if (remember) {
      refreshTokenExpiredAt.setTime(refreshTokenExpiredAt.getTime() + (this.authConfig.refreshTokenTtlRemember * 1000));
      return refreshTokenExpiredAt;
    }

    refreshTokenExpiredAt.setTime(refreshTokenExpiredAt.getTime() + (this.authConfig.refreshTokenTtl * 1000));
    return refreshTokenExpiredAt;
  }

  protected override throwDeletedException(): never {
    this.logger.verbose('throwDeletedException()');

    throw new AuthTokenDeletedException();
  }

  // protected override throwNotDeletedException(): never {
  //   this.logger.verbose('throwNotDeletedException()');

  //   throw new AuthTokenNotDeletedException();
  // }

  protected override throwNotFoundException(): never {
    this.logger.verbose('throwNotFoundException()');

    throw new AuthTokenNotFoundException();
  }
}
