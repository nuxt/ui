import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'never',
      braceStyle: '1tbs'
    }
  }
}).override('nuxt/vue/rules', {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 5 }]
  }
}).override('nuxt/import/rules', {
  rules: {
    'import/first': 'off',
    'import/order': 'off'
  }
}).override('nuxt/typescript/rules', {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
}).append({
  ignores: [
    'docs/**'
  ]
})
