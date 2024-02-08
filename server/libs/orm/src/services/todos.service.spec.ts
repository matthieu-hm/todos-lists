import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { entities } from '../entities';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        DatabaseModule,
        TypeOrmModule.forFeature(entities),
      ],
      providers: [TodosService],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
