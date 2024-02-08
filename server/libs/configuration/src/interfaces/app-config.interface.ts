export interface IAppConfig {
  port: number;
  isSwaggerEnabled: boolean;
  front: {
    scheme: string;
    host: string;
    url: string;
  };
  api: {
    scheme: string;
    host: string;
    pathPrefix: string;
    versionPrefix: string;
    prefix: string;
    baseUrl: string;
    url: string;
  };
}
