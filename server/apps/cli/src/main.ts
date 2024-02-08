import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
import { ConfigService } from '@nestjs/config';
import { ILoggerConfig } from '@app/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  // Get logger configuration from the configuration service
  const app1 = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });
  const configService = app1.get(ConfigService);
  const loggerConfig = configService.getOrThrow<ILoggerConfig>('logger');
  app1.useLogger(['error', 'warn']);
  await app1.close();

  await CommandFactory.run(AppModule, loggerConfig.nest);
}
bootstrap();
