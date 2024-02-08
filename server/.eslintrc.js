module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    'no-restricted-imports': ['error', '@app/testing'],
  },
  overrides: [
    /**
     * SERVER - ENTITIES
     */
    {
      files: [
        '**/*.entity.ts',
      ],
      rules: {
        'import/no-cycle': 'off',
      },
    },
    {
      files: [
        '**/*.service.ts',
      ],
      rules: {
        'no-underscore-dangle': 'off',
      },
    },
    /**
     * SERVER - TEST
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
