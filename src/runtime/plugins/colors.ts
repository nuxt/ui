import { computed } from 'vue'
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from '#imports'
// FIXME: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app'
import type { UseHeadInput } from '@unhead/vue/types'
import colors from 'tailwindcss/colors'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

  function generateShades(key: string, value: string) {
    return `${shades.map(shade => `--ui-color-${key}-${shade}: var(--color-${value === 'neutral' ? 'old-neutral' : value}-${shade}, ${getTWColor(value as keyof typeof colors, shade)});`).join('\n  ')}`
  }
  function generateColor(key: string, shade: number) {
    return `--ui-${key}: var(--ui-color-${key}-${shade});`
  }

  const root = computed(() => {
    const { neutral, ...colors } = appConfig.ui.colors

    return `@layer base {
  :root {
  ${Object.entries(appConfig.ui.colors).map(([key, value]: [string, string]) => generateShades(key, value)).join('\n  ')}
  }
  :root, .light {
  ${Object.keys(colors).map(key => generateColor(key, 500)).join('\n  ')}
  }
  .dark {
  ${Object.keys(colors).map(key => generateColor(key, 400)).join('\n  ')}
  }
}`
  })

  // Head
  const headData: UseHeadInput = {
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

function getTWColor<
  T extends keyof typeof colors,
  S extends 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
>(color: T, shade: S): string {
  if (color in colors && typeof colors[color] === 'object' && shade in colors[color]) {
    return colors[color][shade as unknown as keyof (typeof colors)[T]] as string
  }
  return ''
}
