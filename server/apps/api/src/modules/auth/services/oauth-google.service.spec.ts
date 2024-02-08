import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@app/configuration';
import { OauthGoogleService } from './oauth-google.service';

describe('OauthGoogleService', () => {
  let service: OauthGoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
      ],
      providers: [OauthGoogleService],
    }).compile();

    service = module.get<OauthGoogleService>(OauthGoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
