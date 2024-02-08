import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { OrmModule } from '@app/orm';
import { TodosController } from './todos.controller';

describe('TodosController', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        OrmModule,
      ],
      controllers: [TodosController],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
