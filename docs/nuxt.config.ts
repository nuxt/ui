import ui from '../src/module'

export default defineNuxtConfig({
  modules: [
    // @ts-ignore
    ui,
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxtjs/plausible',
    '@nuxthq/studio',
    'nuxt-lodash',
    'nuxt-component-meta'
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: 'material-default',
        light: 'material-lighter',
        dark: 'material-darker'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
    }
  },
  ui: {
    global: true,
    icons: ['heroicons', 'mdi']
  },
  typescript: {
    strict: false
  }
})
