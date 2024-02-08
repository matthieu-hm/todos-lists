import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { entities } from '../entities';
import { ListsService } from './lists.service';

describe('ListsService', () => {
  let service: ListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        DatabaseModule,
        TypeOrmModule.forFeature(entities),
      ],
      providers: [ListsService],
    }).compile();

    service = module.get<ListsService>(ListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
