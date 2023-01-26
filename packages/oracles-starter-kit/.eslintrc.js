module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-expressions': 'off',
    'no-undef': 'off',
    'no-async-promise-executor': 'off'
  }
}
