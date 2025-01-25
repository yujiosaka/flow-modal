import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import lit from 'eslint-plugin-lit';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:lit/recommended',
    'plugin:prettier/recommended',
  ),
  {
    ignores: ['dist/*'],
  },
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      lit,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
