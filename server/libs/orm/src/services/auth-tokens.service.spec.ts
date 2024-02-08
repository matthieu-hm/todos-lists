import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { entities } from '../entities';
import { AuthTokensService } from './auth-tokens.service';

describe('AuthTokensService', () => {
  let service: AuthTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        TypeOrmModule.forFeature(entities),
      ],
      providers: [AuthTokensService],
    }).compile();

    service = module.get<AuthTokensService>(AuthTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
