import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IDatabaseConfig {
  connections: {
    default: TypeOrmModuleOptions;
  };
}
