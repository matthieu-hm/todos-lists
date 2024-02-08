import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalErrorsFilter, HttpErrorsFilter } from '@app/common';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { OrmModule } from '@app/orm';
import { SlackAlerterModule } from '@app/slack-alerter';
import { UsersCommand } from './commands/users.command';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    ConfigModule,
    OrmModule,
    SlackAlerterModule,
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
    UsersCommand,
  ],
})
export class AppModule {}
