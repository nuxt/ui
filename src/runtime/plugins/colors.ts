import { computed } from 'vue'
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from '#imports'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  function generateColor(key: string, value: string) {
    return `${shades.map(shade => `--color-${key}-${shade}: var(--color-${value}-${shade});`).join('\n  ')}`
  }

  const root = computed(() => {
    return `:root {
  ${Object.entries(appConfig.ui.colors).map(([key, value]: [string, string]) => generateColor(key, value)).join('\n  ')}
  --color-primary-DEFAULT: var(--color-primary-500);
}
@media (prefers-color-scheme: dark) {
  --color-primary-DEFAULT: var(--color-primary-400);
}
`
  })

  // Head
  const headData: any = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: 'nuxt-ui-colors',
      type: 'text/css'
    }]
  }

  // SPA mode
  if (import.meta.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement('style')

    style.innerHTML = root.value
    style.setAttribute('data-nuxt-ui-colors', '')
    document.head.appendChild(style)

    headData.script = [{
      innerHTML: 'document.head.removeChild(document.querySelector(\'[data-nuxt-ui-colors]\'))'
    }]
  }

  useHead(headData)
})
