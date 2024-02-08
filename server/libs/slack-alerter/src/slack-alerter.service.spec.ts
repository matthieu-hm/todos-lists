import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@app/configuration';
import { SlackAlerterService } from './slack-alerter.service';

describe('SlackAlerterService', () => {
  let service: SlackAlerterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        ConfigModule,
        HttpModule,
      ],
      providers: [SlackAlerterService],
    }).compile();

    service = module.get<SlackAlerterService>(SlackAlerterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
