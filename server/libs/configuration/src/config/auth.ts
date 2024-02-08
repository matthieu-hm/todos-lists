import { IAuthConfig } from '../interfaces';

export default (): IAuthConfig => {
  // Expressed in seconds
  const accessTokenTtl = process.env['AUTH_ACCESS_TOKEN_TTL'] ? +process.env['AUTH_ACCESS_TOKEN_TTL'] : 600;
  const refreshTokenTtl = process.env['AUTH_REFRESH_TOKEN_TTL'] ? +process.env['AUTH_REFRESH_TOKEN_TTL'] : 3600 * 3;
  const refreshTokenTtlRemember = process.env['AUTH_REFRESH_TOKEN_TTL_REMEMBER'] ? +process.env['AUTH_REFRESH_TOKEN_TTL_REMEMBER'] : 3600 * 24 * 30;

  return {
    accessTokenTtl,
    refreshTokenTtl,
    refreshTokenTtlRemember,
    checkIpConsistency: process.env['AUTH_CHECK_IP_CONSISTENCY'] === 'true', // default: false
    checkOsAndBrowserConsistency: process.env['AUTH_CHECK_OS_AND_BROWSER_CONSISTENCY'] === 'true', // default: false
  };
};
