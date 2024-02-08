import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { services } from './services';

@Module({
  providers: services,
  exports: services,
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature(entities),
  ],
})
export class OrmModule {}
