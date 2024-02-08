import { IEnvConfig } from '../interfaces';

export default (): IEnvConfig => {
  const environment = process.env['NODE_ENV'] || 'local';
  const isDev = !['production', 'preprod', 'test', 'recette'].includes(environment);
  const isTest = ['test'].includes(environment);

  return {
    environment,
    isDev,
    isTest,
  };
};
