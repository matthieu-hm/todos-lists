import { IConfig } from '../interfaces';
import app from './app';
import auth from './auth';
import database from './database';
import env from './env';
import logger from './logger';
import oauth from './oauth';
import session from './session';

export default (): IConfig => ({
  env: env(),
  app: app(),
  auth: auth(),
  database: database(),
  logger: logger(),
  oauth: oauth(),
  session: session(),
});
