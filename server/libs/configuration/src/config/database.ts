import { merge } from 'lodash';
import { DeepPartial } from 'typeorm';
import { IDatabaseConfig } from '../interfaces';
import envConfigFn from './env';

export default (): IDatabaseConfig => {
  const envConfig = envConfigFn();

  // Hack to avoid type conflict
  const connectionType: any = process.env['DATABASE_TYPE'] || 'postgres';
  const databaseName = process.env['DATABASE_NAME'] || 'brainstorming';

  const config: IDatabaseConfig = {
    connections: {
      default: {
        type: connectionType,
        host: process.env['DATABASE_HOST'] || 'localhost',
        port: process.env['DATABASE_PORT'] ? +process.env['DATABASE_PORT'] : 5432,
        username: process.env['DATABASE_USERNAME'] || 'postgres',
        password: process.env['DATABASE_PASSWORD'] || 'root',
        database: databaseName,
        logging: process.env['DATABASE_LOGGING'] === 'true', // default: false
        synchronize: process.env['DATABASE_SYNCHRONIZE'] !== 'false', // default: true
        ssl: process.env['DATABASE_SSL'] === 'true', // default: false
        extra: process.env['DATABASE_EXTRA'] ? JSON.parse(process.env['DATABASE_EXTRA']) : undefined,
      },
    },
  };

  const testEnvConfig: DeepPartial<IDatabaseConfig> = envConfig.isTest
    ? {
      connections: {
        default: {
          database: process.env['DATABASE_NAME_TEST'] || databaseName,
          synchronize: true,
        },
      },
    }
    : {};

  return merge(config, testEnvConfig);
};
