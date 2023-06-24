module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  rules: {
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 5
      }
    }]
  }
}
