export interface IAuthConfig {
  accessTokenTtl: number;
  refreshTokenTtl: number;
  refreshTokenTtlRemember: number;
  checkIpConsistency: boolean;
  checkOsAndBrowserConsistency: boolean;
}
