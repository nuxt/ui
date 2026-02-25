import { themeIcons } from '../utils/theme'
import { omit } from '#ui/utils'
import colors from 'tailwindcss/colors'

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const { track } = useAnalytics()

  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
  const neutral = computed({
    get() {
      return appConfig.ui.colors.neutral
    },
    set(option) {
      appConfig.ui.colors.neutral = option
      window.localStorage.setItem('nuxt-ui-neutral', appConfig.ui.colors.neutral)
      track('Theme Changed', { setting: 'neutral', value: option })
    }
  })

  const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
  const primaryColors = Object.keys(omit(colors, colorsToOmit as any))
  const primary = computed({
    get() {
      return appConfig.ui.colors.primary
    },
    set(option) {
      appConfig.ui.colors.primary = option
      window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.colors.primary)
      setBlackAsPrimary(false)
      track('Theme Changed', { setting: 'primary', value: option })
    }
  })

  const radiuses = [0, 0.125, 0.25, 0.375, 0.5]
  const radius = computed({
    get() {
      return appConfig.theme.radius
    },
    set(option) {
      appConfig.theme.radius = option
      window.localStorage.setItem('nuxt-ui-radius', String(appConfig.theme.radius))
      track('Theme Changed', { setting: 'radius', value: option })
    }
  })

  const fonts = ['Public Sans', 'DM Sans', 'Geist', 'Inter', 'Poppins', 'Outfit', 'Raleway']
  const font = computed({
    get() {
      return appConfig.theme.font
    },
    set(option) {
      appConfig.theme.font = option
      window.localStorage.setItem('nuxt-ui-font', appConfig.theme.font)
      track('Theme Changed', { setting: 'font', value: option })
    }
  })

  const icons = [{
    label: 'Lucide',
    icon: 'i-lucide-feather',
    value: 'lucide'
  }, {
    label: 'Phosphor',
    icon: 'i-ph-phosphor-logo',
    value: 'phosphor'
  }, {
    label: 'Tabler',
    icon: 'i-tabler-brand-tabler',
    value: 'tabler'
  }]
  const icon = computed({
    get() {
      return appConfig.theme.icons
    },
    set(option) {
      appConfig.theme.icons = option
      appConfig.ui.icons = themeIcons[option as keyof typeof themeIcons] as any
      window.localStorage.setItem('nuxt-ui-icons', appConfig.theme.icons)
      track('Theme Changed', { setting: 'icons', value: option })
    }
  })

  const modes = [
    { label: 'light', icon: appConfig.ui.icons.light },
    { label: 'dark', icon: appConfig.ui.icons.dark },
    { label: 'system', icon: appConfig.ui.icons.system }
  ]
  const mode = computed({
    get() {
      return colorMode.value
    },
    set(option) {
      colorMode.preference = option
      track('Theme Changed', { setting: 'colorMode', value: option })
    }
  })

  function setBlackAsPrimary(value: boolean) {
    appConfig.theme.blackAsPrimary = value
    window.localStorage.setItem('nuxt-ui-black-as-primary', String(value))
    if (value) {
      track('Theme Changed', { setting: 'primary', value: 'black' })
    }
  }

  const aiThemeExtras = computed(() => {
    if (import.meta.server) return {}
    try {
      return JSON.parse(window.localStorage.getItem('nuxt-ui-ai-theme') || '{}')
    } catch {
      return {}
    }
  })

  const hasCustomColors = computed(() => {
    if (import.meta.server) return false
    return !!window.localStorage.getItem('nuxt-ui-custom-colors')
  })

  const hasCSSChanges = computed(() => {
    return appConfig.theme.radius !== 0.25
      || appConfig.theme.blackAsPrimary
      || appConfig.theme.font !== 'Public Sans'
      || hasCustomColors.value
  })

  const hasAppConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== 'green'
      || appConfig.ui.colors.neutral !== 'slate'
      || appConfig.theme.icons !== 'lucide'
      || !!aiThemeExtras.value.colors
      || !!aiThemeExtras.value.ui
  })

  function exportCSS(): string {
    track('Theme Exported', { type: 'CSS' })

    const lines = [
      '@import "tailwindcss";',
      '@import "@nuxt/ui";'
    ]

    const themeLines: string[] = []
    if (appConfig.theme.font !== 'Public Sans') {
      themeLines.push(`  --font-sans: '${appConfig.theme.font}', sans-serif;`)
    }

    const customColors: Record<string, Record<string, string>> = (() => {
      try {
        return JSON.parse(window.localStorage.getItem('nuxt-ui-custom-colors') || '{}')
      } catch {
        return {}
      }
    })()
    for (const [name, shades] of Object.entries(customColors)) {
      for (const [shade, hex] of Object.entries(shades)) {
        themeLines.push(`  --color-${name}-${shade}: ${hex};`)
      }
    }

    if (themeLines.length) {
      lines.push('', '@theme static {', ...themeLines, '}')
    }

    const rootLines: string[] = []
    if (appConfig.theme.radius !== 0.25) {
      rootLines.push(`  --ui-radius: ${appConfig.theme.radius}rem;`)
    }
    if (appConfig.theme.blackAsPrimary) {
      rootLines.push('  --ui-primary: black;')
    }

    if (rootLines.length) {
      lines.push('', ':root {', ...rootLines, '}')
    }

    if (appConfig.theme.blackAsPrimary) {
      lines.push('', '.dark {', '  --ui-primary: white;', '}')
    }

    return lines.join('\n')
  }

  function exportAppConfig(): string {
    track('Theme Exported', { type: 'AppConfig' })

    const config: Record<string, any> = {}

    const defaultColors: Record<string, string> = { primary: 'green', neutral: 'slate', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
    const colorEntries = Object.entries(defaultColors).filter(([key, def]) => (appConfig.ui.colors as any)[key] !== def)
    if (colorEntries.length) {
      config.ui = { colors: Object.fromEntries(colorEntries.map(([key]) => [key, (appConfig.ui.colors as any)[key]])) }
    }

    if (appConfig.theme.icons !== 'lucide') {
      const iconSet = appConfig.theme.icons
      const icons = themeIcons[iconSet as keyof typeof themeIcons]
      config.ui = config.ui || {}
      config.ui.icons = icons
    }

    const extras = aiThemeExtras.value
    if (extras.ui) {
      config.ui = config.ui || {}
      Object.assign(config.ui, extras.ui)
    }

    const configString = JSON.stringify(config, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'')

    return `export default defineAppConfig(${configString})`
  }

  function injectCustomColors(customColors: Record<string, Record<string, string>>) {
    const existing: Record<string, Record<string, string>> = JSON.parse(window.localStorage.getItem('nuxt-ui-custom-colors') || '{}')
    const merged = { ...existing, ...customColors }
    window.localStorage.setItem('nuxt-ui-custom-colors', JSON.stringify(merged))

    let styleEl = document.getElementById('chat-custom-colors') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'chat-custom-colors'
      document.head.appendChild(styleEl)
    }

    const vars = Object.entries(merged).flatMap(([name, shades]) =>
      Object.entries(shades).map(([shade, hex]) => `--color-${name}-${shade}: ${hex};`)
    )

    styleEl.textContent = `:root { ${vars.join(' ')} }`
  }

  function applyThemeSettings(settings: Record<string, any>) {
    if (settings.customColors && typeof settings.customColors === 'object') {
      injectCustomColors(settings.customColors)
    }

    if (settings.primary) primary.value = settings.primary
    if (settings.neutral) neutral.value = settings.neutral
    if (settings.radius !== undefined) radius.value = settings.radius
    if (settings.font) font.value = settings.font
    if (settings.blackAsPrimary !== undefined) setBlackAsPrimary(settings.blackAsPrimary)

    const colorKeys = ['secondary', 'success', 'info', 'warning', 'error'] as const
    const savedExtras: Record<string, any> = JSON.parse(window.localStorage.getItem('nuxt-ui-ai-theme') || '{}')

    for (const color of colorKeys) {
      if (settings[color]) {
        (appConfig.ui.colors as any)[color] = settings[color]
        savedExtras.colors = savedExtras.colors || {}
        savedExtras.colors[color] = settings[color]
      }
    }

    if (settings.ui) {
      savedExtras.ui = savedExtras.ui || {}
      for (const [key, value] of Object.entries(settings.ui)) {
        if (key === 'colors' || key === 'icons') continue
        ;(appConfig.ui as any)[key] = value
        savedExtras.ui[key] = value
      }
    }

    window.localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))

    track('AI Theme Applied')
  }

  function resetTheme() {
    track('Theme Reset')

    appConfig.ui.colors.primary = 'green'
    window.localStorage.removeItem('nuxt-ui-primary')

    appConfig.ui.colors.neutral = 'slate'
    window.localStorage.removeItem('nuxt-ui-neutral')

    appConfig.theme.radius = 0.25
    window.localStorage.removeItem('nuxt-ui-radius')

    appConfig.theme.font = 'Public Sans'
    window.localStorage.removeItem('nuxt-ui-font')

    appConfig.theme.icons = 'lucide'
    appConfig.ui.icons = themeIcons.lucide as any
    window.localStorage.removeItem('nuxt-ui-icons')

    appConfig.theme.blackAsPrimary = false
    window.localStorage.removeItem('nuxt-ui-black-as-primary')

    const defaultColors: Record<string, string> = { secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
    const aiTheme = window.localStorage.getItem('nuxt-ui-ai-theme')
    if (aiTheme) {
      try {
        const extras = JSON.parse(aiTheme)
        if (extras.colors) {
          for (const key of Object.keys(extras.colors)) {
            (appConfig.ui.colors as any)[key] = defaultColors[key] || (appConfig.ui.colors as any)[key]
          }
        }
        if (extras.ui) {
          for (const key of Object.keys(extras.ui)) {
            (appConfig.ui as any)[key] = undefined
          }
        }
      } catch {
        // ignore malformed localStorage
      }
    }
    window.localStorage.removeItem('nuxt-ui-ai-theme')
    window.localStorage.removeItem('nuxt-ui-custom-colors')
    document.getElementById('chat-custom-colors')?.remove()
  }

  return {
    neutralColors,
    neutral,
    primaryColors,
    primary,
    setBlackAsPrimary,
    radiuses,
    radius,
    fonts,
    font,
    icon,
    icons,
    modes,
    mode,
    hasCSSChanges,
    hasAppConfigChanges,
    exportCSS,
    exportAppConfig,
    applyThemeSettings,
    resetTheme
  }
}
