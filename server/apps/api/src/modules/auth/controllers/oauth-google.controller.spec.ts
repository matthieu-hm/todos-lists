import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { ConfigurationModule } from '@app/configuration';
import { OrmModule } from '@app/orm';
import { OauthGoogleService } from '../services/oauth-google.service';
import { OauthGoogleController } from './oauth-google.controller';

describe('OauthGoogleController', () => {
  let controller: OauthGoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        OrmModule,
      ],
      providers: [OauthGoogleService],
      controllers: [OauthGoogleController],
    }).compile();

    controller = module.get<OauthGoogleController>(OauthGoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
