import { OrmModule } from '@app/orm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenGuard } from './guards';
import { AccessTokenStrategy, RefreshTokenStrategy } from './passport-strategies';

@Module({
  imports: [
    ConfigModule,
    OrmModule,
    PassportModule,
  ],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    // by default every route need a bearer token
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AuthModule {}
