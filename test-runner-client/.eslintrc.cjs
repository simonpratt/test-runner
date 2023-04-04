module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true,
    browser: true,
  },
  extends: ['@dtdot/eslint-config/react'],
  ignorePatterns: ['node_modules', 'dist', '.prettierrc.js', '.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
  },
};
