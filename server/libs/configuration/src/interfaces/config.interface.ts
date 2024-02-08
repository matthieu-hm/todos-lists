import { IAppConfig } from './app-config.interface';
import { IAuthConfig } from './auth-config.interface';
import { IDatabaseConfig } from './database-config.interface';
import { IEnvConfig } from './env-config.interface';
import { ILoggerConfig } from './logger-config.interface';
import { IOAuthConfig } from './oauth-config.interface';
import { ISessionConfig } from './session-config.interface';

export interface IConfig {
  env: IEnvConfig,
  app: IAppConfig,
  auth: IAuthConfig,
  database: IDatabaseConfig,
  logger: ILoggerConfig,
  oauth: IOAuthConfig,
  session: ISessionConfig,
}
