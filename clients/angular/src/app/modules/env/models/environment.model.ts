import { IEnvironment } from '../interfaces';

export class Environment {
  production!: boolean;

  apiUrl!: string;

  wsUrl!: string;

  constructor(environment: IEnvironment) {
    Object.assign(this, environment);

    /* eslint-disable @typescript-eslint/ban-ts-comment */
    /* eslint-disable no-underscore-dangle */

    // @ts-ignore
    Object.assign(this, window.__env || {});

    /* eslint-enable @typescript-eslint/ban-ts-comment */
    /* eslint-enable no-underscore-dangle */
  }
}
