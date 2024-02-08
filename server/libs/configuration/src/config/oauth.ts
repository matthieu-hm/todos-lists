import { IOAuthConfig } from '../interfaces';

export default (): IOAuthConfig => ({
  google: {
    issuer: process.env['OAUTH_GOOGLE_ISSUER'] || 'https://accounts.google.com',
    clientId: process.env['OAUTH_GOOGLE_CLIENT_ID'] || '',
    clientSecret: process.env['OAUTH_GOOGLE_CLIENT_SECRET'] || '',
  },
});
