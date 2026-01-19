import { themeIcons } from '../utils/theme'
import { omit } from '#ui/utils'
import colors from 'tailwindcss/colors'

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const { track } = useAnalytics()

  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone']
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

  const hasCSSChanges = computed(() => {
    return appConfig.theme.radius !== 0.25
      || appConfig.theme.blackAsPrimary
      || appConfig.theme.font !== 'Public Sans'
  })

  const hasAppConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== 'green'
      || appConfig.ui.colors.neutral !== 'slate'
      || appConfig.theme.icons !== 'lucide'
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

    if (appConfig.ui.colors.primary !== 'green' || appConfig.ui.colors.neutral !== 'slate') {
      config.ui = { colors: {} }
      if (appConfig.ui.colors.primary !== 'green') {
        config.ui.colors.primary = appConfig.ui.colors.primary
      }
      if (appConfig.ui.colors.neutral !== 'slate') {
        config.ui.colors.neutral = appConfig.ui.colors.neutral
      }
    }

    if (appConfig.theme.icons !== 'lucide') {
      const iconSet = appConfig.theme.icons
      const icons = themeIcons[iconSet as keyof typeof themeIcons]
      config.ui = config.ui || {}
      config.ui.icons = icons
    }

    const configString = JSON.stringify(config, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'')

    return `export default defineAppConfig(${configString})`
  }

  function resetTheme() {
    track('Theme Reset')

    // Reset without triggering individual tracking events
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
    resetTheme
  }
}
