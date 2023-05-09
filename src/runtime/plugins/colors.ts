import { computed } from 'vue'
import { hexToRgb } from '../utils/colors'
import { defineNuxtPlugin, useHead, useAppConfig } from '#imports'
import colors from '#tailwind-config/theme/colors'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const root = computed(() => `:root {
${Object.entries(colors[appConfig.ui.primary]).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}

${Object.entries(colors[appConfig.ui.gray]).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
  }`)

  // Head
  const headData: any = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2
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
