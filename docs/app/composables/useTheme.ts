import { defu } from 'defu'
import { useLocalStorage } from '@vueuse/core'
import { themeIcons, cssVariableDefaults } from '../utils/theme'
import { omit } from '#ui/utils'
import colors from 'tailwindcss/colors'

function readLocalStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const { track } = useAnalytics()

  const aiThemeExtras = useState<Record<string, any>>('nuxt-ui-ai-theme', () => readLocalStorage('nuxt-ui-ai-theme', {}))
  const customColorsData = useState<Record<string, Record<string, string>>>('nuxt-ui-custom-colors', () => readLocalStorage('nuxt-ui-custom-colors', {}))
  const cssVariablesData = useState<{ light?: Record<string, string>, dark?: Record<string, string> }>('nuxt-ui-css-variables', () => readLocalStorage('nuxt-ui-css-variables', {}))
  const _radius = useLocalStorage('nuxt-ui-radius', 0.25)
  const _font = useLocalStorage('nuxt-ui-font', 'Public Sans')
  const _iconSet = useLocalStorage('nuxt-ui-icons', 'lucide')
  const _blackAsPrimary = useLocalStorage('nuxt-ui-black-as-primary', false)

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
      return _radius.value
    },
    set(option) {
      _radius.value = option
      track('Theme Changed', { setting: 'radius', value: option })
    }
  })

  const fonts = ['Public Sans', 'DM Sans', 'Geist', 'Inter', 'Poppins', 'Outfit', 'Raleway']

  const font = computed({
    get() {
      return _font.value
    },
    set(option) {
      _font.value = option
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
      return _iconSet.value
    },
    set(option) {
      _iconSet.value = option
      appConfig.ui.icons = themeIcons[option as keyof typeof themeIcons] as any
      track('Theme Changed', { setting: 'icons', value: option })
    }
  })

  const modes = computed(() => [
    { label: 'light', icon: appConfig.ui.icons.light },
    { label: 'dark', icon: appConfig.ui.icons.dark },
    { label: 'system', icon: appConfig.ui.icons.system }
  ])
  const mode = computed({
    get() {
      return colorMode.value
    },
    set(option) {
      colorMode.preference = option
      track('Theme Changed', { setting: 'colorMode', value: option })
    }
  })

  const blackAsPrimary = computed(() => _blackAsPrimary.value)

  function setBlackAsPrimary(value: boolean) {
    _blackAsPrimary.value = value
    if (value) {
      track('Theme Changed', { setting: 'primary', value: 'black' })
    }
  }

  const hasCustomColors = computed(() => Object.keys(customColorsData.value).length > 0)
  const hasCSSVariables = computed(() => Object.keys(cssVariablesData.value.light || {}).length > 0 || Object.keys(cssVariablesData.value.dark || {}).length > 0)

  const radiusStyle = computed(() => `:root { --ui-radius: ${_radius.value}rem; }`)
  const blackAsPrimaryStyle = computed(() => _blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
  const fontStyle = computed(() => `:root { --font-sans: '${_font.value}', sans-serif; }`)
  const customColorsStyle = computed(() => {
    const entries = Object.entries(customColorsData.value)
    if (!entries.length) return ''
    const vars = entries.flatMap(([name, shades]) =>
      Object.entries(shades).map(([shade, hex]) => `--color-${name}-${shade}: ${hex};`)
    )
    return `:root { ${vars.join(' ')} }`
  })
  const cssVariablesStyle = computed(() => {
    const data = cssVariablesData.value
    const parts: string[] = []
    if (Object.keys(data.light || {}).length) {
      const full = { ...cssVariableDefaults.light, ...data.light }
      parts.push(`.light { ${Object.entries(full).map(([k, v]) => `${k}: ${v};`).join(' ')} }`)
    }
    if (Object.keys(data.dark || {}).length) {
      const full = { ...cssVariableDefaults.dark, ...data.dark }
      parts.push(`.dark { ${Object.entries(full).map(([k, v]) => `${k}: ${v};`).join(' ')} }`)
    }
    return parts.join(' ')
  })

  const link = computed(() => {
    const name = _font.value
    if (name === 'Public Sans') return []
    return [{
      rel: 'stylesheet' as const,
      href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`,
      id: `font-${name.toLowerCase().replace(/\s+/g, '-')}`
    }]
  })

  const style = [
    { innerHTML: radiusStyle, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
    { innerHTML: fontStyle, id: 'nuxt-ui-font', tagPriority: -2 },
    { innerHTML: customColorsStyle, id: 'chat-custom-colors', tagPriority: -2 },
    { innerHTML: cssVariablesStyle, id: 'chat-css-variables', tagPriority: -2 }
  ]

  const hasCSSChanges = computed(() => {
    return _radius.value !== 0.25
      || _blackAsPrimary.value
      || _font.value !== 'Public Sans'
      || hasCustomColors.value
      || hasCSSVariables.value
  })

  const hasAppConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== 'green'
      || appConfig.ui.colors.neutral !== 'slate'
      || _iconSet.value !== 'lucide'
      || !!aiThemeExtras.value.colors
      || !!aiThemeExtras.value.ui
  })

  function exportCSS(): string {
    track('Theme Exported', { type: 'CSS' })

    const lines = [
      '@import "tailwindcss";',
      '@import "@nuxt/ui";'
    ]

    if (_font.value !== 'Public Sans') {
      lines.push('', '@theme {', `  --font-sans: '${_font.value}', sans-serif;`, '}')
    }

    const colorLines: string[] = []
    for (const [name, shades] of Object.entries(customColorsData.value)) {
      for (const [shade, hex] of Object.entries(shades)) {
        colorLines.push(`  --color-${name}-${shade}: ${hex};`)
      }
    }

    if (colorLines.length) {
      lines.push('', '@theme static {', ...colorLines, '}')
    }

    const lightOverrides = Object.entries(cssVariablesData.value.light || {}).filter(([key, val]) => val !== cssVariableDefaults.light[key as keyof typeof cssVariableDefaults.light])
    const darkOverrides = Object.entries(cssVariablesData.value.dark || {}).filter(([key, val]) => val !== cssVariableDefaults.dark[key as keyof typeof cssVariableDefaults.dark])

    const rootLines: string[] = []
    if (_radius.value !== 0.25) {
      rootLines.push(`  --ui-radius: ${_radius.value}rem;`)
    }
    if (_blackAsPrimary.value) {
      rootLines.push('  --ui-primary: black;')
    }

    if (rootLines.length) {
      lines.push('', ':root {', ...rootLines, '}')
    }

    if (lightOverrides.length) {
      lines.push('', ':root, .light {', ...lightOverrides.map(([key, val]) => `  ${key}: ${val};`), '}')
    }

    const darkLines: string[] = []
    if (_blackAsPrimary.value) {
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

    if (_iconSet.value !== 'lucide') {
      const iconMapping = themeIcons[_iconSet.value as keyof typeof themeIcons]
      config.ui = config.ui || {}
      config.ui.icons = iconMapping
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
    const merged = { ...customColorsData.value, ...customColors }
    customColorsData.value = merged
    window.localStorage.setItem('nuxt-ui-custom-colors', JSON.stringify(merged))
  }

  function injectCSSVariables(cssVariables: { light?: Record<string, string>, dark?: Record<string, string> }) {
    const merged = {
      light: { ...cssVariablesData.value.light, ...cssVariables.light },
      dark: { ...cssVariablesData.value.dark, ...cssVariables.dark }
    }
    cssVariablesData.value = merged
    window.localStorage.setItem('nuxt-ui-css-variables', JSON.stringify(merged))
  }

  function applyThemeSettings(settings: Record<string, any>) {
    if (settings.customColors && typeof settings.customColors === 'object') {
      injectCustomColors(settings.customColors)
    }

    if (settings.cssVariables && typeof settings.cssVariables === 'object') {
      injectCSSVariables(settings.cssVariables)
    }

    if (settings.primary) primary.value = settings.primary
    if (settings.neutral) neutral.value = settings.neutral
    if (settings.radius !== undefined) radius.value = settings.radius
    if (settings.font) font.value = settings.font
    if (settings.icons && settings.icons in themeIcons) icon.value = settings.icons
    if (settings.blackAsPrimary !== undefined) setBlackAsPrimary(!!settings.blackAsPrimary)

    const colorKeys = ['secondary', 'success', 'info', 'warning', 'error'] as const
    const savedExtras: Record<string, any> = { ...aiThemeExtras.value }

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

        const merged = defu(value as Record<string, any>, (appConfig.ui as any)[key] || {}, savedExtras.ui[key] || {})
        ;(appConfig.ui as any)[key] = merged
        savedExtras.ui[key] = merged
      }
    }

    aiThemeExtras.value = savedExtras
    window.localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))

    track('AI Theme Applied')
  }

  function resetTheme() {
    track('Theme Reset')

    appConfig.ui.colors.primary = 'green'
    window.localStorage.removeItem('nuxt-ui-primary')

    appConfig.ui.colors.neutral = 'slate'
    window.localStorage.removeItem('nuxt-ui-neutral')

    _radius.value = 0.25
    _font.value = 'Public Sans'
    _iconSet.value = 'lucide'
    appConfig.ui.icons = themeIcons.lucide as any
    _blackAsPrimary.value = false

    const defaultColors: Record<string, string> = { secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
    const extras = aiThemeExtras.value
    if (extras.colors) {
      for (const key of Object.keys(extras.colors)) {
        (appConfig.ui.colors as any)[key] = defaultColors[key] || (appConfig.ui.colors as any)[key]
      }
    }
    if (extras.ui) {
      for (const key of Object.keys(extras.ui)) {
        if (key === 'colors' || key === 'icons') continue
        (appConfig.ui as any)[key] = undefined
      }
    }
    window.localStorage.removeItem('nuxt-ui-ai-theme')
    window.localStorage.removeItem('nuxt-ui-custom-colors')
    window.localStorage.removeItem('nuxt-ui-css-variables')
    aiThemeExtras.value = {}
    customColorsData.value = {}
    cssVariablesData.value = {}

    if (import.meta.client) {
      document.getElementById('chat-css-variables')?.replaceChildren()
      document.getElementById('chat-custom-colors')?.replaceChildren()
    }
  }

  return {
    style,
    link,
    neutralColors,
    neutral,
    primaryColors,
    primary,
    blackAsPrimary,
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
