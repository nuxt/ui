import { computed } from 'vue'
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from '#imports'
// FIXME: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  function generateShades(key: string, value: string) {
    return `${shades.map(shade => `--ui-color-${key}-${shade}: var(--color-${value}-${shade});`).join('\n  ')}`
  }
  function generateColor(key: string, shade: number) {
    return `--ui-${key}: var(--ui-color-${key}-${shade});`
  }

  const root = computed(() => {
    const allColors = Object.keys(appConfig.ui.colors)
    const lightColors = new Array(allColors.length - 1)
    const darkColors = new Array(allColors.length - 1)
    const utilities = new Array(allColors.length)
    let colorIndex = 0
    let utilIndex = 0
    for (const key of allColors) {
      utilities[utilIndex++] = generateShades(key, appConfig.ui.colors[key])
      if (key !== "neutral") {
        lightColors[colorIndex] = generateColor(key, 500)
        darkColors[colorIndex++] = generateColor(key, 400)
      }
    }
    return `:root {
  ${utilities.join('\n  ')}

  ${lightColors.join('\n  ')}
}
.dark {
  ${darkColors.join('\n  ')}
}`
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
