import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SlackAlerterService } from '@app/slack-alerter';
import { Response } from 'express';
import { IEnvConfig } from '@app/configuration';

@Catch(HttpException)
export class HttpErrorsFilter extends BaseExceptionFilter {
  private envConfig = this.configService.getOrThrow<IEnvConfig>('env');

  constructor(
    private configService: ConfigService,
    private slackAlerterService: SlackAlerterService,
  ) {
    super();
  }

  override catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    if (exception.getStatus() > 499) {
      this.slackAlerterService.alertHttpException(exception, request);

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
