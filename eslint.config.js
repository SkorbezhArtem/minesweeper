import airbnbBase from 'eslint-config-airbnb-base';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['minesweeper/src/js/**/*.js'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        AudioContext: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      ...airbnbBase.rules,
      'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
      'no-param-reassign': ['error', { props: false }],
    },
  },
];
