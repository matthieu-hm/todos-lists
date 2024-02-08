import { ILoggerConfig } from '@app/configuration';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class SlackAlerterService {
  private loggerConfig = this.configService.getOrThrow<ILoggerConfig>('logger');

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  alertHttpException(exception: HttpException, request: Request) {
    this.send(
      request.method,
      request.originalUrl,
      exception.getStatus(),
      exception.name,
      exception.message,
      exception.stack,
    );
  }

  alertError(exception: Error, request: Request) {
    this.send(
      request.method,
      request.originalUrl,
      request.statusCode || 500,
      exception.name,
      exception.message,
      exception.stack,
    );
  }

  private send(
    method: string,
    url: string,
    statusCode: number,
    name: string,
    message?: string,
    stack?: string,
  ) {
    // TODO: user ? query_params ? post_data ?

    const slackConfig = this.loggerConfig.slack;

    if (!slackConfig.isEnabled) {
      return;
    }

    const header = [statusCode, name].filter((str) => !!str).join(' ');

    const txt = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: header,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*URL*: \`${method} ${url}\``,
          },
        },
      ],
    };

    if (message) {
      txt.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message*: ${message}`,
        },
      });
    }

    if (stack) {
      txt.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Stack*:\n\`\`\`${stack}\`\`\``,
        },
      });
    }

    this.httpService
      .post(slackConfig.url, txt)
      .subscribe();
  }
}
