import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  ClassSerializerInterceptor, MiddlewareConsumer, Module, RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import { v4 as uuid } from 'uuid';
import * as sessionFileStore from 'session-file-store';
import { GlobalErrorsFilter, HttpErrorsFilter, MorganLoggerMiddleware } from '@app/common';
import { ConfigurationModule, ISessionConfig } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { OrmModule } from '@app/orm';
import { SlackAlerterModule } from '@app/slack-alerter';
import { AuthModule } from '@app/auth';
import { AuthModule as ApiAuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TodosListsModule } from './modules/todos-lists/todos-lists.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    ConfigModule,
    OrmModule,
    SlackAlerterModule,
    AuthModule, // @app/auth
    ApiAuthModule, // ./modules/auth
    UsersModule,
    TodosListsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalErrorsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  private sessionConfig = this.configService.getOrThrow<ISessionConfig>('session');

  constructor(
    private configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const SessionFileStore = sessionFileStore(session);

    consumer
      .apply(
        MorganLoggerMiddleware,
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    consumer
      .apply(
        session({
          store: new SessionFileStore(),
          secret: this.sessionConfig.secret,
          saveUninitialized: true,
          resave: false,
          cookie: {
            httpOnly: this.sessionConfig.cookie.httpOnly,
            secure: this.sessionConfig.cookie.secure,
          },
          genid() {
            return uuid();
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes({
        path: 'oauth/*',
        method: RequestMethod.ALL,
      });
  }
}
