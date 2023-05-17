import ui from '../src/module'

export default defineNuxtConfig({
  // @ts-ignore
  modules: [
    ui,
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/devtools',
    '@nuxthq/studio',
    '@nuxtjs/plausible',
    'nuxt-lodash',
    'nuxt-component-meta'
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        light: 'material-lighter',
        dark: 'material-palenight'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
    }
  },
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },
  typescript: {
    strict: false,
    includeWorkspace: true
  },
  // @ts-ignore
  $production: {
    routeRules: {
      '/api/_content/**': { isr: true, static: true },
      '/api/component-meta/**': { isr: true, static: true }
    }
  },
  routeRules: {
    // '/getting-started': { swr: 100000 }
  }
})
