import { computed } from 'vue'
import { get, hexToRgb } from '../utils'
import { defineNuxtPlugin, useAppConfig, useHead, useNuxtApp, useRuntimeConfig } from '#imports'
import colors from '#tailwind-config/theme/colors'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const root = computed(() => {
    const theme = runtimeConfig.public.nuxtUi.theme
    const ui = appConfig.ui

    const primary: Record<string, string> | undefined = theme.primary && ui.primary === 'primary'
      ? theme.primary
      : get(colors, ui.primary)
    const gray: Record<string, string> | undefined = theme.gray && ui.gray === 'gray'
      ? theme.gray
      : get(colors, ui.gray)

    if (!primary) {
      console.warn(`[@nuxt/ui] Primary color '${ui.primary}' not found in Tailwind config`)
    }
    if (!gray) {
      console.warn(`[@nuxt/ui] Gray color '${ui.gray}' not found in Tailwind config`)
    }

    return `:root {
${Object.entries(primary || colors.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}
--color-primary-DEFAULT: var(--color-primary-500);

${Object.entries(gray || colors.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
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
