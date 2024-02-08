import { IAppConfig } from '../interfaces';

export default (): IAppConfig => {
  const port = process.env['APP_PORT'] ? +process.env['APP_PORT'] : 3000;

  const frontScheme = process.env['APP_FRONT_SCHEME'] || 'http';
  const frontHost = process.env['APP_FRONT_HOST'] || 'localhost:4200';

  // Throw an error if url is invalid
  const frontUrl = new URL(`${frontScheme}://${frontHost}`).toString();

  const apiScheme = process.env['APP_API_SCHEME'] || 'http';
  const apiHost = process.env['APP_API_HOST'] || `localhost:${port}`;
  const apiPathPrefix = process.env['APP_API_PATH_PREFIX'] || 'api';
  const apiVersionPrefix = process.env['APP_API_VERSION_PREFIX'] || 'v1';
  const apiPrefix = `${apiPathPrefix}/${apiVersionPrefix}`
    .split('/')
    .filter((segment) => !!segment)
    .join('/');
  const apiBaseUrl = new URL(`${apiScheme}://${apiHost}`).toString();
  const apiUrl = new URL(`${apiBaseUrl}${apiPrefix}/`).toString();

  const isSwaggerEnabled = process.env['APP_IS_SWAGGER_ENABLED'] === 'true'; // default: false

  return {
    port,
    isSwaggerEnabled,
    front: {
      scheme: frontScheme,
      host: frontHost,
      url: frontUrl,
    },
    api: {
      scheme: apiScheme,
      host: apiHost,
      pathPrefix: apiPathPrefix,
      versionPrefix: apiVersionPrefix,
      prefix: apiPrefix,
      baseUrl: apiBaseUrl,
      url: apiUrl,
    },
  };
};
