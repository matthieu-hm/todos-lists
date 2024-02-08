import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrmModule } from '@app/orm';
import { UsersMeController } from './controllers/users-me.controller';

@Module({
  imports: [
    ConfigModule,
    OrmModule,
  ],
  controllers: [UsersMeController],
})
export class UsersModule {}
