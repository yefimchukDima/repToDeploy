module.exports = {
  root: true,
  extends: ['airbnb-typescript/base', 'prettier'],
  plugins: ['import', 'prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['camelCase'],
      },
    ],
    'import/no-extraneous-dependencies': ['warn'],
    '@typescript-eslint/no-redeclare': ['warn'],
  },
};
