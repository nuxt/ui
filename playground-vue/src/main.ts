import { createApp, defineAsyncComponent, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import uiPlugin from '@nuxt/ui/vue-plugin'

import App from './app.vue'

const pages = import.meta.glob('../../playground/app/pages/**/*.vue')
const components = import.meta.glob('../../playground/app/components/**/*.vue')

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\.\/\.\.\/playground\/app\/pages(.*)\.vue$/)![1].toLowerCase()
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

Object.entries(components).forEach(([path, component]) => {
  const name = path.split('/').pop()!.replace('.vue', '')
  app.component(name, defineAsyncComponent(component as any))
})

app.use(router)
app.use(uiPlugin)

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
