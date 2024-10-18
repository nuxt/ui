import type { Plugin } from 'vue'

import NuxtIcon from '../components/nuxt-icon'

export default {
  install(app) {
    app.component('Icon', NuxtIcon)
  }
} satisfies Plugin
