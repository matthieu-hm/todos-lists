module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  ignorePatterns: [
    'env.js',
    'env.js.example',
  ],
  extends: [
    'plugin:@angular-eslint/recommended',
    'plugin:@angular-eslint/template/process-inline-templates',
  ],
  rules: {
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: 'app',
        style: 'camelCase'
      }
    ],
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: 'app',
        style: 'kebab-case'
      }
    ],
    "import/prefer-default-export": 'off',
  },
  overrides: [
    /**
     * CLIENT - MODELS
     */
    {
      files: [
        '**/*.model.ts',
      ],
      rules: {
        'import/no-cycle': 'off',
      },
    },
    /**
     * CLIENT - karma.conf.js
     */
    {
      files: [
        'karma.conf.js',
      ],
      rules: {
        'global-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    /**
     * CLIENT - polyfills.ts
     */
    {
      files: [
        '**/polyfills.ts',
      ],
      rules: {
        'max-len': 'off',
      },
    },
    /**
     * CLIENT - TEST
     */
    {
      files: [
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/test/**/*',
        'libs/testing/**/*',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-restricted-imports': 'off',
      },
    },
  ],
};
