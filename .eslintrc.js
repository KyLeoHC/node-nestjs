module.exports = {
  root: true,
  env: {
    es2017: true,
    node: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'webpack.config.js'],
  rules: {
    // typescript-eslint rules
    '@typescript-eslint/indent': ['error', 2],
    // once typescript-eslint support these rules, we will remove it
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'ignore'
    }],
    'semi': ['error', 'always'],
    'lines-between-class-members': 0,
    'dot-notation': 0
  }
};
