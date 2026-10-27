import { computed, shallowRef } from 'vue'
import type { UseHeadInput } from '@unhead/vue/types'
import { colors as bundledColors, loadColors } from '#build/ui-colors'
import { defineNuxtPlugin, injectHead, useAppConfig, useNuxtApp, useHead } from '#imports'

type Colors = Awaited<ReturnType<typeof loadColors>>

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

function getColor(colors: Colors | undefined, color: keyof Colors, shade: typeof shades[number]): string {
  if (colors && color in colors && typeof colors[color] === 'object' && shade in colors[color]) {
    return colors[color][shade] as string
  }
  return ''
}

function generateShades(colors: Colors | undefined, key: string, value: string, prefix?: string) {
  const prefixStr = prefix ? `${prefix}-` : ''
  return `${shades.map(shade => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === 'neutral' ? 'old-neutral' : value}-${shade}, ${getColor(colors, value as keyof Colors, shade)});`).join('\n  ')}`
}
function generateColor(key: string, shade: number) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`
}

function generateRoot(colors: Colors | undefined, uiColors: Record<string, string>, prefix?: string) {
  const { neutral, ...rest } = uiColors

  return `@layer theme {
  :root, :host {
  ${Object.entries(uiColors).map(([key, value]) => generateShades(colors, key, value, prefix)).join('\n  ')}
  }
  :root, :host, .light {
  ${Object.keys(rest).map(key => generateColor(key, 500)).join('\n  ')}
  }
  .dark {
  ${Object.keys(rest).map(key => generateColor(key, 400)).join('\n  ')}
  }
}`
}

const FALLBACK_RE = /(var\(--[^,;]+,) [^;]*\);/g

function removeTemporaryColorsStyle() {
  document.querySelector('[data-nuxt-ui-colors]')?.remove()
}

export default defineNuxtPlugin(async () => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()
  const head = injectHead()

  const ssrStyle = import.meta.client && !bundledColors && nuxtApp.isHydrating && nuxtApp.payload.serverRendered
    ? document.getElementById('nuxt-ui-colors')?.textContent ?? undefined
    : undefined
  // Fallback values only depend on the palette, so comparing without them checks
  // that the server rendered the same colors and prefix.
  const ssrSkeleton = ssrStyle?.replace(FALLBACK_RE, '$1 );')

  const colors = shallowRef(bundledColors ?? (ssrStyle === undefined ? await loadColors() : undefined))
  let loading: Promise<void> | undefined

  // Plugins running after this one can still change the colors before hydration ends.
  const hydrated = shallowRef(false)
  if (ssrStyle !== undefined) {
    nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
      hydrated.value = true
    })
  }

  const root = computed(() => {
    const prefix = (appConfig.ui as { prefix?: string }).prefix

    if (ssrStyle === undefined || colors.value) {
      return generateRoot(colors.value, appConfig.ui.colors, prefix)
    }

    if (hydrated.value && generateRoot(undefined, appConfig.ui.colors, prefix) !== ssrSkeleton) {
      loading ||= loadColors().then((loaded) => {
        colors.value = loaded
      }, (error) => {
        loading = undefined
        console.error('[@nuxt/ui] Failed to load the colors palette:', error)
      })
    }
    return ssrStyle
  })

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

    style.textContent = root.value
    style.setAttribute('data-nuxt-ui-colors', '')
    document.head.appendChild(style)

    // `hookOnce` is only available on unhead v2's `Hookable`. In v3 `hooks` is a `HookableCore`
    // that exposes `hook` only, so self-unhook to keep the once semantics across both versions.
    const unhook = head.hooks?.hook('dom:rendered', () => {
      removeTemporaryColorsStyle()
      unhook?.()
    })
  }

  useHead(headData, { head })
})
