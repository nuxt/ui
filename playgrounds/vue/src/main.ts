import './assets/css/main.css'

import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'

import App from './app.vue'

const pages = import.meta.glob(['../../nuxt/app/pages/*.vue', '../../nuxt/app/pages/components/*.vue'])

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\.\/\.\.\/nuxt\/app\/pages(.*)\.vue$/)![1].toLowerCase()
  return {
    path: name === '/index' ? '/' : name,
    component: pages[path]
  }
})

const router = createRouter({
  routes,
  history: createWebHistory()
})

const app = createApp(App)

app.use(router)
app.use(ui)

// @ts-expect-error unknown global property
globalThis.useFetch = async (url: string, options: RequestInit & { transform?: (data) => any } = {}) => {
  const data = ref()
  const status = ref('idle')
  async function _fetch() {
    status.value = 'loading'
    try {
      data.value = await fetch(url, options).then(r => r.json()).then(r => options.transform ? options.transform(r) : r)
      status.value = 'success'
    } catch (error) {
      console.error(error)
      status.value = 'error'
    }
  }
  _fetch()
  return Promise.resolve({
    data,
    status
  })
}

app.mount('#app')
