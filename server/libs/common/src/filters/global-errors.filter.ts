import { BaseExceptionFilter } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  ArgumentsHost, Catch, HttpException,
} from '@nestjs/common';
import { SlackAlerterService } from '@app/slack-alerter';
import { IEnvConfig } from '@app/configuration';

@Catch()
export class GlobalErrorsFilter extends BaseExceptionFilter {
  private envConfig = this.configService.getOrThrow<IEnvConfig>('env');

  constructor(
    private configService: ConfigService,
    private slackAlerterService: SlackAlerterService,
  ) {
    super();
  }

  override catch(exception: Error, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      const response = host.switchToHttp().getResponse();
      const request = host.switchToHttp().getRequest();

      this.slackAlerterService.alertError(exception, request);

      if (this.envConfig.isDev) {
        return super.catch(exception, host);
      }

      // For security reasons, no details except if in dev mode
      return response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }

    return super.catch(exception, host);
  }
}
