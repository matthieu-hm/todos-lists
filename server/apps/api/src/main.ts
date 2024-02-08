import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, ILoggerConfig } from '@app/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<IAppConfig>('app');
  const loggerConfig = configService.getOrThrow<ILoggerConfig>('logger');

  app.useLogger(loggerConfig.nest);

  app.setGlobalPrefix(appConfig.api.prefix);

  app.enableCors();

  // Auto-validation of DTOs
  app.useGlobalPipes(new ValidationPipe({
    // Keep only defined properties in DTOs
    whitelist: true,
    // Transform payloads to be objects typed according to their DTO classes:
    // types & default values
    transform: true,
  }));

  if (appConfig.isSwaggerEnabled) {
    // Swagger logic
  }

  await app.listen(appConfig.port, '0.0.0.0');
}
bootstrap();
