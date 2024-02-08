import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { ConfigurationModule } from '@app/configuration';
import { OrmModule } from '@app/orm';
import { OauthLocalController } from './oauth-local.controller';

describe('OauthLocalController', () => {
  let controller: OauthLocalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        OrmModule,
      ],
      providers: [],
      controllers: [OauthLocalController],
    }).compile();

    controller = module.get<OauthLocalController>(OauthLocalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
