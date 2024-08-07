import { computed } from 'vue'
import { get, parseConfigValue } from '../utils'
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from '#imports'
import colors from '#tailwind-config/theme/colors'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const root = computed(() => {
    const primary: Record<string, string> | undefined = get(colors, appConfig.ui.primary)
    const gray: Record<string, string> | undefined = get(colors, appConfig.ui.gray)

    if (!primary) {
      console.warn(`[@nuxt/ui] Primary color '${appConfig.ui.primary}' not found in Tailwind config`)
    }
    if (!gray) {
      console.warn(`[@nuxt/ui] Gray color '${appConfig.ui.gray}' not found in Tailwind config`)
    }

    return `:root {
${Object.entries(primary || colors.green).map(([key, value]) => `--color-primary-${key}: ${parseConfigValue(value)};`).join('\n')}
--color-primary-DEFAULT: var(--color-primary-500);

${Object.entries(gray || colors.cool).map(([key, value]) => `--color-gray-${key}: ${parseConfigValue(value)};`).join('\n')}
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
      id: 'nuxt-ui-colors'
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
