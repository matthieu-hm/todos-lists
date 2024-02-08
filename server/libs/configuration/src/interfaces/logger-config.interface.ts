import { LogLevel } from '@nestjs/common';

export interface ILoggerConfig {
  nest: LogLevel[];
  morgan: {
    isEnabled: boolean;
    format: string;
  };
  slack: {
    isEnabled: boolean;
    url: string;
  };
}
