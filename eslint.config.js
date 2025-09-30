import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      indent: ['error', 2, {
        ignoredNodes: ['CallExpression > MemberExpression']
      }],
      quotes: ['error', 'single'],
      'keyword-spacing': ['error', {
        before: true,
        after: true,
        overrides: {
          if: { after: false },
          for: { after: false },
          while: { after: false },
          switch: { after: false },
          catch: { after: false }
        }
      }],
      'space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'never'
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': 'off',
      'import/no-anonymous-default-export': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/react-in-jsx-scope': 'off'
    }
  }
])
