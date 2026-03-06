import { defu } from 'defu'
import { themeIcons, cssVariableDefaults } from '../utils/theme'
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
  const loadedFonts = new Set(fonts.map(f => f.toLowerCase()))

  function loadFont(name: string) {
    const key = name.toLowerCase()
    if (loadedFonts.has(key)) return

    const linkId = `font-${key.replace(/\s+/g, '-')}`
    if (document.getElementById(linkId)) {
      loadedFonts.add(key)
      return
    }

    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
    loadedFonts.add(key)
  }

  const font = computed({
    get() {
      return appConfig.theme.font
    },
    set(option) {
      if (import.meta.client) loadFont(option)
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

  const aiThemeExtras = ref<Record<string, any>>({})
  const hasCustomColors = ref(false)
  const hasCSSVariables = ref(false)

  if (import.meta.client) {
    try {
      aiThemeExtras.value = JSON.parse(window.localStorage.getItem('nuxt-ui-ai-theme') || '{}')
    } catch {
      aiThemeExtras.value = {}
    }

    hasCustomColors.value = !!window.localStorage.getItem('nuxt-ui-custom-colors')
    hasCSSVariables.value = !!window.localStorage.getItem('nuxt-ui-css-variables')
  }

  const hasCSSChanges = computed(() => {
    return appConfig.theme.radius !== 0.25
      || appConfig.theme.blackAsPrimary
      || appConfig.theme.font !== 'Public Sans'
      || hasCustomColors.value
      || hasCSSVariables.value
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

    if (appConfig.theme.font !== 'Public Sans') {
      lines.push('', '@theme {', `  --font-sans: '${appConfig.theme.font}', sans-serif;`, '}')
    }

    const customColors: Record<string, Record<string, string>> = (() => {
      try {
        return JSON.parse(window.localStorage.getItem('nuxt-ui-custom-colors') || '{}')
      } catch {
        return {}
      }
    })()
    const colorLines: string[] = []
    for (const [name, shades] of Object.entries(customColors)) {
      for (const [shade, hex] of Object.entries(shades)) {
        colorLines.push(`  --color-${name}-${shade}: ${hex};`)
      }
    }

    if (colorLines.length) {
      lines.push('', '@theme static {', ...colorLines, '}')
    }

    const cssVariables: { light?: Record<string, string>, dark?: Record<string, string> } = (() => {
      try {
        return JSON.parse(window.localStorage.getItem('nuxt-ui-css-variables') || '{}')
      } catch {
        return {}
      }
    })()

    const lightOverrides = Object.entries(cssVariables.light || {}).filter(([key, val]) => val !== cssVariableDefaults.light[key as keyof typeof cssVariableDefaults.light])
    const darkOverrides = Object.entries(cssVariables.dark || {}).filter(([key, val]) => val !== cssVariableDefaults.dark[key as keyof typeof cssVariableDefaults.dark])

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

    if (lightOverrides.length) {
      lines.push('', ':root, .light {', ...lightOverrides.map(([key, val]) => `  ${key}: ${val};`), '}')
    }

    const darkLines: string[] = []
    if (appConfig.theme.blackAsPrimary) {
      darkLines.push('  --ui-primary: white;')
    }
    if (darkOverrides.length) {
      darkLines.push(...darkOverrides.map(([key, val]) => `  ${key}: ${val};`))
    }

    if (darkLines.length) {
      lines.push('', '.dark {', ...darkLines, '}')
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

  function injectCSSVariables(cssVariables: { light?: Record<string, string>, dark?: Record<string, string> }) {
    const existing: { light?: Record<string, string>, dark?: Record<string, string> } = (() => {
      try {
        return JSON.parse(window.localStorage.getItem('nuxt-ui-css-variables') || '{}')
      } catch {
        return {}
      }
    })()
    const merged = {
      light: { ...existing.light, ...cssVariables.light },
      dark: { ...existing.dark, ...cssVariables.dark }
    }
    window.localStorage.setItem('nuxt-ui-css-variables', JSON.stringify(merged))

    let styleEl = document.getElementById('chat-css-variables') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'chat-css-variables'
      document.head.appendChild(styleEl)
    }

    const parts: string[] = []
    if (Object.keys(merged.light || {}).length) {
      const full = { ...cssVariableDefaults.light, ...merged.light }
      const lightVars = Object.entries(full).map(([key, val]) => `${key}: ${val};`)
      parts.push(`.light { ${lightVars.join(' ')} }`)
    }
    if (Object.keys(merged.dark || {}).length) {
      const full = { ...cssVariableDefaults.dark, ...merged.dark }
      const darkVars = Object.entries(full).map(([key, val]) => `${key}: ${val};`)
      parts.push(`.dark { ${darkVars.join(' ')} }`)
    }

    styleEl.textContent = parts.join(' ')
  }

  function applyThemeSettings(settings: Record<string, any>) {
    if (settings.customColors && typeof settings.customColors === 'object') {
      injectCustomColors(settings.customColors)
      hasCustomColors.value = true
    }

    if (settings.cssVariables && typeof settings.cssVariables === 'object') {
      injectCSSVariables(settings.cssVariables)
      hasCSSVariables.value = true
    }

    if (settings.primary) primary.value = settings.primary
    if (settings.neutral) neutral.value = settings.neutral
    if (settings.radius !== undefined) radius.value = settings.radius
    if (settings.font) font.value = settings.font
    if (settings.icons) icon.value = settings.icons
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
        if (key === 'colors') continue

        const merged = defu(value as Record<string, any>, savedExtras.ui[key] || {}) as Record<string, any>
        ;(appConfig.ui as any)[key] = merged
        savedExtras.ui[key] = merged
      }
    }

    window.localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))
    aiThemeExtras.value = savedExtras

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
            if (key === 'colors' || key === 'icons') continue
            ;(appConfig.ui as any)[key] = undefined
          }
        }
      } catch {
        // ignore malformed localStorage
      }
    }
    window.localStorage.removeItem('nuxt-ui-ai-theme')
    window.localStorage.removeItem('nuxt-ui-custom-colors')
    window.localStorage.removeItem('nuxt-ui-css-variables')
    document.getElementById('chat-custom-colors')?.remove()
    document.getElementById('chat-css-variables')?.remove()

    aiThemeExtras.value = {}
    hasCustomColors.value = false
    hasCSSVariables.value = false
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
