import { Linter } from 'eslint'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import eslintPluginImport from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'

/** @type {Linter.Config} */
const config = [
  // Global language options (parser and globals)
  {
    languageOptions: {
      globals: {
        browser: 'readonly',
        node: 'readonly',
        es2021: true,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      import: eslintPluginImport,
    },
    rules: {
      // ESLint's recommended rules
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      eqeqeq: 'warn',

      // TypeScript ESLint plugin rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      // React ESLint plugin rules
      'react/prop-types': 'off', // React PropTypes can be disabled if using TypeScript
      'react/react-in-jsx-scope': 'off', // Disable for modern React with JSX transformations

      // Prettier ESLint plugin rules
      'prettier/prettier': ['error'],

      // Other potential plugin rules you want to enable
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
    ignores: [
      // System files
      '.DS_Store',

      // Dependencies
      'node_modules',

      // Production files
      'dist',
      '*.html',

      // Local environment files
      '.env*.local',

      // TypeScript files
      'vite-env.d.ts',
    ],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
    languageOptions: {
      globals: {
        node: 'readonly',
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      // Explicitly enabling TypeScript, React, and Prettier plugin rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['error'],

      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'], // Встроенные и внешние модули
            ['internal'], // Внутренние модули
            ['parent', 'sibling', 'index'], // Родительские и соседние модули
            ['object'], // Для всех объектов, например, импорты стилей
          ],
          'newlines-between': 'always', // Добавление пустой строки между группами
          alphabetize: {
            order: 'asc', // Сортировка по алфавиту
            caseInsensitive: true, // Игнорирование регистра
          },
        },
      ],
    },
  },
]

export default config
