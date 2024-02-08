export interface IOAuthOptions {
  name: string;
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authorizationUrlExtraParams: { [key: string]: string | number | boolean };
}
