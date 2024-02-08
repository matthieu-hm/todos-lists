import { ISessionConfig } from '../interfaces';

export default (): ISessionConfig => ({
  secret: process.env['SESSION_SECRET'] || 'ThisIsSecret',
  cookie: {
    httpOnly: process.env['SESSION_COOKIE_HTTP_ONLY'] !== 'false', // default: true
    secure: process.env['SESSION_COOKIE_SECURE'] === 'true', // default: false
  },
});
