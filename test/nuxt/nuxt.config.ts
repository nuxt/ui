export default defineNuxtConfig({
  modules: ['../../src/module'],
  ui: {
    content: true
  },
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  }
})
