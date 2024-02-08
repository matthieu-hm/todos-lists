module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        'patterns': [
          '**/../server/*',
          '**/../client/*',
        ]
      }
    ],
  },
};
