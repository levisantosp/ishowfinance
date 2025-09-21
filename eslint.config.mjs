import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import { defineConfig } from "eslint/config"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/*.jsx",
      "**/*.tsx"
    ]
  },
  {
    rules: {
      indent: ["error", 2, {
        ignoredNodes: ["CallExpression > MemberExpression"]
      }],
      quotes: ["error", "double"],
      "keyword-spacing": ["error", {
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
      "space-before-function-paren": ["error", {
        anonymous: "never",
        named: "never",
        asyncArrow: "never"
      }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-empty": "off",
      "@typescript-eslint/no-unused-expressions": "off"
    }
  }
])