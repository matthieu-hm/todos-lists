import { IDatabaseConfig } from '@app/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.getOrThrow<IDatabaseConfig>('database');

        return {
          ...databaseConfig.connections.default,
          autoLoadEntities: true,
          useUTC: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
