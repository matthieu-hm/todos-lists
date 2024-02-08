import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrmModule } from '@app/orm';
import { ListsController } from './controllers/lists.controller';
import { TodosController } from './controllers/todos.controller';

@Module({
  imports: [
    ConfigModule,
    OrmModule,
  ],
  controllers: [ListsController, TodosController],
})
export class TodosListsModule {}
