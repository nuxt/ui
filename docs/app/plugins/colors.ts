import { computed } from 'vue'
import colors from 'tailwindcss/colors'
import type { UseHeadInput } from '@unhead/vue/types'
import { defineNuxtPlugin, injectHead, useAppConfig, useNuxtApp, useHead } from '#imports'

/**
 * The palettes the theme picker and studio switch at runtime, from the docs'
 * own `appConfig.colors`. The library's defaults sit in `@layer theme` at zero
 * specificity, so these win from `@layer base` on `:root`.
 */
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

function getColor(color: keyof typeof colors, shade: typeof shades[number]): string {
  if (color in colors && typeof colors[color] === 'object' && shade in colors[color]) {
    return colors[color][shade] as string
  }
  return ''
}

function generateShades(key: string, value: string) {
  return `${shades.map(shade => `--ui-color-${key}-${shade}: var(--color-${value === 'neutral' ? 'old-neutral' : value}-${shade}, ${getColor(value as keyof typeof colors, shade)});`).join('\n  ')}`
}

function removeTemporaryColorsStyle() {
  document.querySelector('[data-nuxt-ui-colors]')?.remove()
}

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const root = computed(() => `@layer base {
  :root, :host {
  ${Object.entries(appConfig.colors).map(([key, value]) => generateShades(key, value as string)).join('\n  ')}
  }
}`)

  // Head
  const headData: UseHeadInput = {
    style: [{
      innerHTML: root,
      tagPriority: 'critical',
      id: 'nuxt-ui-colors'
    }]
  }

  // SPA mode
  if (import.meta.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement('style')

    style.innerHTML = root.value
    style.setAttribute('data-nuxt-ui-colors', '')
    document.head.appendChild(style)

    // `hookOnce` is only available on unhead v2's `Hookable`. In v3 `hooks` is a `HookableCore`
    // that exposes `hook` only, so self-unhook to keep the once semantics across both versions.
    const head = injectHead()
    const unhook = head.hooks?.hook('dom:rendered', () => {
      removeTemporaryColorsStyle()
      unhook?.()
    })
  }

  useHead(headData)
})
