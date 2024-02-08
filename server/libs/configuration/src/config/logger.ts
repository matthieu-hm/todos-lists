import { Logger, LogLevel } from '@nestjs/common';
import { ILoggerConfig } from '../interfaces';

export default (): ILoggerConfig => {
  const logger = new Logger('@app/configuration');

  const nestLoggerOpt: LogLevel[] = [];

  if (process.env['LOGGER_NEST_SHOW_LOG'] !== 'false') {
    nestLoggerOpt.push('log');
  }
  if (process.env['LOGGER_NEST_SHOW_ERROR'] !== 'false') {
    nestLoggerOpt.push('error');
  }
  if (process.env['LOGGER_NEST_SHOW_WARN'] !== 'false') {
    nestLoggerOpt.push('warn');
  }
  if (process.env['LOGGER_NEST_SHOW_DEBUG'] !== 'false') {
    nestLoggerOpt.push('debug');
  }
  if (process.env['LOGGER_NEST_SHOW_VERBOSE'] !== 'false') {
    nestLoggerOpt.push('verbose');
  }

  let slackIsEnabled = process.env['LOGGER_SLACK_IS_ENABLED'] === 'true'; // default: false
  let slackUrl = process.env['LOGGER_SLACK_URL'] || '';

  if (slackIsEnabled) {
    try {
      new URL(slackUrl).toString();
    } catch (err) {
      slackIsEnabled = false;
      slackUrl = '';

      logger.warn('Slack URL invalid: disabled');
    }
  }

  return {
    nest: nestLoggerOpt,
    morgan: {
      isEnabled: process.env['LOGGER_MORGAN_IS_ENABLED'] !== 'false', // default: true
      format: process.env['LOGGER_MORGAN_FORMAT'] || 'dev',
    },
    slack: {
      isEnabled: slackIsEnabled,
      url: slackUrl,
    },
  };
};
