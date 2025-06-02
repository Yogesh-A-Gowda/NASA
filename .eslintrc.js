module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 🔧 TypeScript Rules
    '@typescript-eslint/no-explicit-any': 'warn', // Change to 'off' if needed temporarily
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // 🛑 React Rules
    'react/no-unescaped-entities': ['warn', { forbid: ['>', '"', '}'] }],

    // Optional: Formatting & Style
    'prefer-const': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};