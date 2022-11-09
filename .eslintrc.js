module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: resolve(__dirname, 'tsconfig.build.json'),
    sourceType: 'module',
    tsconfigRootDir: './',
  },
  ignorePatterns: ['.eslintrc.js'],
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
}
