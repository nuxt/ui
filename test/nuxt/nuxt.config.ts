export default defineNuxtConfig({
  modules: ['../../src/module'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },
  ui: {
    content: true
  }
})
