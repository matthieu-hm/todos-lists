import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { OrmModule } from '@app/orm';
import { ListsController } from './lists.controller';

describe('ListsController', () => {
  let controller: ListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        OrmModule,
      ],
      controllers: [ListsController],
    }).compile();

    controller = module.get<ListsController>(ListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
