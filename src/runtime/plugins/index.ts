import { computed } from 'vue'
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from '#imports'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const root = computed(() => {
    return `:root {
${shades.map(shade => `--color-primary-${shade}: var(--color-${appConfig.ui.primary}-${shade});`).join('\n')}
--color-primary-DEFAULT: var(--color-primary-500);
${shades.map(shade => `--color-gray-${shade}: var(--color-${appConfig.ui.gray}-${shade});`).join('\n')}
}
.dark {
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
  if (process.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
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
