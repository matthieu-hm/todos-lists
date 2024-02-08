const defaultProjectConfig = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { babelConfig: true, tsconfig: 'tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/auth(|/.*)$': '<rootDir>/libs/auth/src/$1',
    '^@app/common(|/.*)$': '<rootDir>/libs/common/src/$1',
    '^@app/configuration(|/.*)$': '<rootDir>/libs/configuration/src/$1',
    '^@app/database(|/.*)$': '<rootDir>/libs/database/src/$1',
    '^@app/orm(|/.*)$': '<rootDir>/libs/orm/src/$1',
    '^@app/shared(|/.*)$': '<rootDir>/../shared/src/$1',
    '^@app/slack-alerter(|/.*)$': '<rootDir>/libs/slack-alerter/src/$1',
    '^@app/testing(|/.*)$': '<rootDir>/libs/testing/src/$1',
  },
};

const config = {
  ...defaultProjectConfig,
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
  roots: [
    '<rootDir>/apps/',
    '<rootDir>/libs/',
  ],
  projects: [
    {
      ...defaultProjectConfig,
      displayName: 'apps:api',
      roots: ['<rootDir>/apps/api'],
    },
    {
      ...defaultProjectConfig,
      displayName: 'libs:auth',
      roots: ['<rootDir>/libs/auth'],
    },
    {
      ...defaultProjectConfig,
      displayName: 'libs:common',
      roots: ['<rootDir>/libs/common'],
    },
    {
      ...defaultProjectConfig,
      displayName: 'libs:configuration',
      roots: ['<rootDir>/libs/configuration'],
    },
    {
      ...defaultProjectConfig,
      displayName: 'libs:database',
      roots: ['<rootDir>/libs/database'],
    },
    {
      ...defaultProjectConfig,
      displayName: 'libs:orm',
      roots: ['<rootDir>/libs/orm'],
    },
    {
      ...defaultProjectConfig,
      displayName: 'libs:slack-alerter',
      roots: ['<rootDir>/libs/slack-alerter'],
    },
  ],
};

export default config;
