import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { OrmModule } from '@app/orm';
import { UsersMeController } from './users-me.controller';

describe('UsersMeController', () => {
  let controller: UsersMeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        OrmModule,
      ],
      controllers: [UsersMeController],
    }).compile();

    controller = module.get<UsersMeController>(UsersMeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
