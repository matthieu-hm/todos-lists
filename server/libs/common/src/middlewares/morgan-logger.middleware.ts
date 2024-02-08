import { ILoggerConfig } from '@app/configuration';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';

@Injectable()
export class MorganLoggerMiddleware implements NestMiddleware {
  private loggerConfig = this.configService.getOrThrow<ILoggerConfig>('logger');

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.loggerConfig.morgan.isEnabled) {
      next();
      return;
    }

    const logger = morgan(this.loggerConfig.morgan.format);

    logger(req, res, () => {
      next();
    });
  }
}
