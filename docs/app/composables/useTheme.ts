import { defu } from 'defu'
import { useLocalStorage } from '@vueuse/core'
import { themeIcons, cssVariableDefaults } from '../utils/theme'
import { generateCSS, generateConfig, mergeUi, DEFAULT_COLORS, THEME_DEFAULTS, LIBRARY_TOKEN_DEFAULTS, CUSTOM_PALETTES } from '../utils/theme-engine'
import type { ThemeDoc, ThemePalette } from '../utils/theme-engine'
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

// AI `applyTheme` output is untrusted and ends up concatenated into <style> rules, so
// only persist values that are plain CSS-safe tokens. This is the single write boundary,
// which keeps every downstream sink (live useHead styles and the FOUC inline scripts) safe.
const SAFE_NAME = /^[\w -]{1,50}$/
const SAFE_HEX = /^#[0-9a-f]{3,8}$/i
// The engine's canonical shade format (tailwind v4 style): `oklch(62.3% 0.214 259.815)`.
const SAFE_OKLCH = /^oklch\(\d{1,3}(?:\.\d+)?% \d(?:\.\d+)? \d{1,3}(?:\.\d+)?\)$/i
const SAFE_CSS_VAR_KEY = /^--[\w-]+$/
const SAFE_CSS_VAR_VALUE = /^(?:var\(--[\w-]+\)|#[0-9a-f]{3,8}|[a-z]+|-?\d{1,3}(?:\.\d+)?(?:px|%))$/i

function sanitizeCustomColors(input: Record<string, any>): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}
  for (const [name, shades] of Object.entries(input)) {
    if (!SAFE_NAME.test(name) || typeof shades !== 'object' || !shades) continue
    const safeShades: Record<string, string> = {}
    for (const [shade, value] of Object.entries(shades as Record<string, unknown>)) {
      if (/^\d{2,3}$/.test(shade) && typeof value === 'string' && (SAFE_OKLCH.test(value) || SAFE_HEX.test(value))) {
        safeShades[shade] = value
      }
    }
    if (Object.keys(safeShades).length) result[name] = safeShades
  }
  return result
}

function sanitizeCSSVariables(input: { light?: Record<string, any>, dark?: Record<string, any> }): { light: Record<string, string>, dark: Record<string, string> } {
  const clean = (vars?: Record<string, unknown>) => {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(vars || {})) {
      if (SAFE_CSS_VAR_KEY.test(key) && typeof value === 'string' && SAFE_CSS_VAR_VALUE.test(value)) {
        result[key] = value
      }
    }
    return result
  }
  return { light: clean(input.light), dark: clean(input.dark) }
}

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const { track } = useAnalytics()
  const { framework } = useFrameworks()

  const aiThemeExtras = useState<Record<string, any>>('nuxt-ui-ai-theme', () => readLocalStorage('nuxt-ui-ai-theme', {}))
  // Style-treatment class bundles live in their OWN channel so restyling
  // (which regenerates the whole bundle) can never destroy preset/AI
  // component overrides that share the same component keys.
  const styleUiData = useState<Record<string, any>>('nuxt-ui-style-ui', () => readLocalStorage('nuxt-ui-style-ui', {}))
  const customColorsData = useState<Record<string, Record<string, string>>>('nuxt-ui-custom-colors', () => readLocalStorage('nuxt-ui-custom-colors', {}))

  // The neutral may be a custom palette (AI themes, studio presets) with no entry in
  // tailwindcss/colors — a throw here would abort the whole unhead flush, taking every
  // other theme <style> down with it.
  const color = computed(() => {
    const neutral = appConfig.ui.colors.neutral
    // Match the page background in both modes (docs light baseline is
    // neutral-50, not white) so browser chrome doesn't seam against the page.
    const shade = colorMode.value === 'dark' ? 900 : 50
    return (colors as any)[neutral]?.[shade] || customColorsData.value[neutral]?.[shade] || CUSTOM_PALETTES[neutral]?.[shade] || (colors as any).slate[shade]
  })
  const cssVariablesData = useState<{ light?: Record<string, string>, dark?: Record<string, string> }>('nuxt-ui-css-variables', () => readLocalStorage('nuxt-ui-css-variables', {}))
  const _radius = useLocalStorage('nuxt-ui-radius', 0.25)
  const _fontSize = useLocalStorage('nuxt-ui-font-size', 16)
  const _spacing = useLocalStorage('nuxt-ui-spacing', 0.25)
  const _font = useLocalStorage('nuxt-ui-font', 'Public Sans')
  const _iconSet = useLocalStorage('nuxt-ui-icons', 'lucide')
  const _blackAsPrimary = useLocalStorage('nuxt-ui-black-as-primary', false)

  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive', 'sand', 'sage', 'ash']
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
  // Custom docs palettes (defined in main.css @theme static) extend tailwind's set.
  const primaryColors = [...Object.keys(omit(colors, colorsToOmit as any)), 'cocoa', 'marine']
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

  const fontSize = computed({
    get() {
      return _fontSize.value
    },
    set(option) {
      _fontSize.value = option
      track('Theme Changed', { setting: 'fontSize', value: option })
    }
  })

  const spacing = computed({
    get() {
      return _spacing.value
    },
    set(option) {
      _spacing.value = option
      track('Theme Changed', { setting: 'spacing', value: option })
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
  // font-size scales every rem metric (UI scale); --spacing is tailwind v4's
  // base unit behind all spacing utilities (density).
  const fontSizeStyle = computed(() => _fontSize.value !== 16 ? `html { font-size: ${_fontSize.value}px; }` : 'html {}')
  const spacingStyle = computed(() => _spacing.value !== 0.25 ? `:root { --spacing: ${_spacing.value}rem; }` : ':root {}')
  const blackAsPrimaryStyle = computed(() => _blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
  const fontStyle = computed(() => `:root { --font-sans: '${_font.value}', sans-serif; }`)
  const customColorsStyle = computed(() => {
    const entries = Object.entries(customColorsData.value)
    if (!entries.length) return ''
    const vars = entries.flatMap(([name, shades]) =>
      Object.entries(shades).map(([shade, color]) => `--color-${name}-${shade}: ${color};`)
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
    { innerHTML: fontSizeStyle, id: 'nuxt-ui-font-size', tagPriority: -2 },
    { innerHTML: spacingStyle, id: 'nuxt-ui-spacing', tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
    { innerHTML: fontStyle, id: 'nuxt-ui-font', tagPriority: -2 },
    { innerHTML: customColorsStyle, id: 'chat-custom-colors', tagPriority: -2 },
    { innerHTML: cssVariablesStyle, id: 'chat-css-variables', tagPriority: -2 }
  ]

  const hasCSSChanges = computed(() => {
    return _radius.value !== 0.25
      || _fontSize.value !== 16
      || _spacing.value !== 0.25
      || _blackAsPrimary.value
      || _font.value !== 'Public Sans'
      || hasCustomColors.value
      || hasCSSVariables.value
  })

  const hasConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== 'green'
      || appConfig.ui.colors.neutral !== 'slate'
      || _iconSet.value !== 'lucide'
      || !!aiThemeExtras.value.colors
      || !!aiThemeExtras.value.ui
  })

  /**
   * Snapshot the live theme state as a sparse ThemeDoc — the single input
   * for the theme-engine export generators and, eventually, the studio's
   * source of truth.
   */
  function currentDoc(): ThemeDoc {
    const doc: ThemeDoc = { version: 1 }

    const colorOverrides: Record<string, string> = {}
    for (const [key, def] of Object.entries(DEFAULT_COLORS)) {
      const value = (appConfig.ui.colors as any)[key]
      if (value && value !== def) {
        colorOverrides[key] = value
      }
    }
    if (Object.keys(colorOverrides).length) {
      doc.colors = colorOverrides
    }

    if (_blackAsPrimary.value) doc.blackAsPrimary = true
    if (_radius.value !== THEME_DEFAULTS.radius) doc.radius = _radius.value
    if (_fontSize.value !== THEME_DEFAULTS.fontSize) doc.fontSize = _fontSize.value
    if (_spacing.value !== THEME_DEFAULTS.spacing) doc.spacing = _spacing.value
    if (_font.value !== THEME_DEFAULTS.font) doc.font = { sans: _font.value }
    if (_iconSet.value !== THEME_DEFAULTS.icons) doc.icons = _iconSet.value

    // Only palettes actually referenced by an alias belong in the export —
    // leftovers from a previous custom palette would bloat the @theme block.
    // Reference by the alias's CURRENT value, not just overrides: a custom
    // palette can shadow a default name (AI retunes 'green' while primary
    // stays 'green') and must still export.
    const referenced = new Set(Object.values(appConfig.ui.colors as Record<string, string>))
    const paletteEntries = Object.entries(customColorsData.value).filter(([name]) => referenced.has(name))
    // Docs-only palettes (sand, cocoa, …) exist in main.css, not tailwind —
    // a consumer's build can't resolve them, so inline their ramps too.
    for (const name of referenced) {
      if (CUSTOM_PALETTES[name] && !customColorsData.value[name]) {
        paletteEntries.push([name, CUSTOM_PALETTES[name]])
      }
    }
    if (paletteEntries.length) {
      doc.palettes = Object.fromEntries(paletteEntries.map(([name, shades]) => [name, { shades: shades as ThemePalette['shades'] }]))
    }

    // Diff against the LIBRARY defaults, not the docs baseline — the export
    // must reproduce the preview on top of a stock @nuxt/ui install.
    const light = Object.fromEntries(Object.entries(cssVariablesData.value.light || {}).filter(([key, val]) => val !== LIBRARY_TOKEN_DEFAULTS.light[key as keyof typeof LIBRARY_TOKEN_DEFAULTS.light]))
    const dark = Object.fromEntries(Object.entries(cssVariablesData.value.dark || {}).filter(([key, val]) => val !== LIBRARY_TOKEN_DEFAULTS.dark[key as keyof typeof LIBRARY_TOKEN_DEFAULTS.dark]))
    if (Object.keys(light).length || Object.keys(dark).length) {
      doc.tokens = {
        ...(Object.keys(light).length ? { light } : {}),
        ...(Object.keys(dark).length ? { dark } : {})
      }
    }

    const extras = aiThemeExtras.value
    if (extras.ui && Object.keys(extras.ui).length) {
      doc.components = extras.ui
    }

    // The studio's shadow/border prefs — generateCSS needs style.shadow to
    // emit the --ui-shadow-color definitions the component classes reference.
    const style = readLocalStorage<{ shadow?: string, border?: string }>('nuxt-ui-style', {})
    if (style.shadow || style.border) {
      doc.style = style as ThemeDoc['style']
    }

    return doc
  }

  function exportCSS(): string {
    track('Theme Exported', { type: 'CSS' })

    return generateCSS(currentDoc())
  }

  function exportConfig(): string {
    track('Theme Exported', { type: 'Config', framework: framework.value })

    return generateConfig(currentDoc(), framework.value)
  }

  function injectCustomColors(customColors: Record<string, Record<string, string>>) {
    const merged = { ...customColorsData.value, ...customColors }
    customColorsData.value = merged
    window.localStorage.setItem('nuxt-ui-custom-colors', JSON.stringify(merged))
  }

  function removeCSSVariables(keys: { light?: string[], dark?: string[] }) {
    const next = {
      light: Object.fromEntries(Object.entries(cssVariablesData.value.light || {}).filter(([key]) => !keys.light?.includes(key))),
      dark: Object.fromEntries(Object.entries(cssVariablesData.value.dark || {}).filter(([key]) => !keys.dark?.includes(key)))
    }
    cssVariablesData.value = next
    if (Object.keys(next.light).length || Object.keys(next.dark).length) {
      window.localStorage.setItem('nuxt-ui-css-variables', JSON.stringify(next))
    } else {
      window.localStorage.removeItem('nuxt-ui-css-variables')
      if (import.meta.client) {
        document.getElementById('chat-css-variables')?.replaceChildren()
      }
    }
  }

  /**
   * Rebuild `appConfig.ui.<component>` for the given keys from the two
   * override channels: the style bundle first, preset/AI extras last (so
   * explicit overrides win the class merge).
   */
  function recomposeComponentOverrides(keys: Iterable<string>) {
    for (const key of keys) {
      const merged = mergeUi(
        { [key]: styleUiData.value[key] },
        { [key]: aiThemeExtras.value.ui?.[key] }
      )[key]
      ;(appConfig.ui as any)[key] = merged && Object.keys(merged).length ? merged : undefined
    }
  }

  /** Replace the style treatment's component bundle wholesale. */
  function setStyleUi(ui: Record<string, any>) {
    const touched = new Set([...Object.keys(styleUiData.value), ...Object.keys(ui)])
    styleUiData.value = ui
    if (Object.keys(ui).length) {
      window.localStorage.setItem('nuxt-ui-style-ui', JSON.stringify(ui))
    } else {
      window.localStorage.removeItem('nuxt-ui-style-ui')
    }
    recomposeComponentOverrides(touched)
  }

  function removeCustomColors(names: string[]) {
    const remaining = Object.fromEntries(Object.entries(customColorsData.value).filter(([name]) => !names.includes(name)))
    customColorsData.value = remaining
    if (Object.keys(remaining).length) {
      window.localStorage.setItem('nuxt-ui-custom-colors', JSON.stringify(remaining))
    } else {
      window.localStorage.removeItem('nuxt-ui-custom-colors')
    }
  }

  function injectCSSVariables(cssVariables: { light?: Record<string, string>, dark?: Record<string, string> }) {
    const merged = {
      light: { ...cssVariablesData.value.light, ...cssVariables.light },
      dark: { ...cssVariablesData.value.dark, ...cssVariables.dark }
    }
    cssVariablesData.value = merged
    window.localStorage.setItem('nuxt-ui-css-variables', JSON.stringify(merged))
  }

  function applyThemeSettings(settings: Record<string, any>, options: { track?: boolean } = {}) {
    // Sanitize once up front — later checks must consult the SANITIZED set,
    // or a rejected palette could still be selected as an alias.
    const safeCustomColors = settings.customColors && typeof settings.customColors === 'object'
      ? sanitizeCustomColors(settings.customColors)
      : {}
    if (Object.keys(safeCustomColors).length) injectCustomColors(safeCustomColors)

    if (settings.cssVariables && typeof settings.cssVariables === 'object') {
      injectCSSVariables(sanitizeCSSVariables(settings.cssVariables))
    }

    if (settings.primary && SAFE_NAME.test(settings.primary)) primary.value = settings.primary
    // Any known palette is a valid neutral (the studio suggests every ramp
    // for either role); custom palettes (injected via customColors) count
    // too, e.g. presets shipping their own ramp.
    if (settings.neutral && SAFE_NAME.test(settings.neutral) && (neutralColors.includes(settings.neutral) || primaryColors.includes(settings.neutral) || (customColorsData.value[settings.neutral] || safeCustomColors[settings.neutral]))) neutral.value = settings.neutral
    if (settings.radius !== undefined && Number.isFinite(Number(settings.radius))) radius.value = Number(settings.radius)
    // Clamped: these scale the whole page, so a wild value would wreck it.
    if (settings.fontSize !== undefined && Number.isFinite(Number(settings.fontSize))) fontSize.value = Math.min(20, Math.max(12, Number(settings.fontSize)))
    if (settings.spacing !== undefined && Number.isFinite(Number(settings.spacing))) spacing.value = Math.min(0.5, Math.max(0.125, Number(settings.spacing)))
    if (settings.font && SAFE_NAME.test(settings.font)) font.value = settings.font
    if (settings.icons && settings.icons in themeIcons) icon.value = settings.icons
    if (settings.blackAsPrimary !== undefined) setBlackAsPrimary(!!settings.blackAsPrimary)

    const colorKeys = ['secondary', 'success', 'info', 'warning', 'error'] as const
    const savedExtras: Record<string, any> = { ...aiThemeExtras.value }

    for (const color of colorKeys) {
      if (settings[color] && SAFE_NAME.test(settings[color])) {
        (appConfig.ui.colors as any)[color] = settings[color]
        savedExtras.colors = savedExtras.colors || {}
        savedExtras.colors[color] = settings[color]
      }
    }

    if (settings.ui) {
      savedExtras.ui = savedExtras.ui || {}
      for (const [key, value] of Object.entries(settings.ui)) {
        // Skip `colors` (handled above) and prototype-chain keys that would pollute appConfig.ui when assigned.
        if (key === 'colors' || key === '__proto__' || key === 'constructor' || key === 'prototype') continue

        savedExtras.ui[key] = defu(value as Record<string, any>, savedExtras.ui[key] || {})
      }
    }

    aiThemeExtras.value = savedExtras
    window.localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))
    if (settings.ui) {
      recomposeComponentOverrides(Object.keys(savedExtras.ui || {}))
    }

    // Hot paths (style sliders, curve drags at ~16Hz) opt out; only real
    // entry points (AI chat, presets) should emit an analytics event.
    if (options.track !== false) {
      track('AI Theme Applied')
    }
  }

  function resetTheme() {
    track('Theme Reset')

    appConfig.ui.colors.primary = 'green'
    window.localStorage.removeItem('nuxt-ui-primary')

    appConfig.ui.colors.neutral = 'slate'
    window.localStorage.removeItem('nuxt-ui-neutral')

    _radius.value = 0.25
    _fontSize.value = 16
    _spacing.value = 0.25
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

    // Studio-owned state must reset with the theme regardless of which
    // reset button was pressed (popover, chat, or studio) — orphaned style
    // prefs would silently resurrect on the next style click or export.
    setStyleUi({})
    window.localStorage.removeItem('nuxt-ui-style')
    window.localStorage.removeItem('nuxt-ui-palette-params')
    window.localStorage.removeItem('nuxt-ui-palette-prev')
    useState<Record<string, any>>('nuxt-ui-style-prefs').value = {}
    useState<string | undefined>('nuxt-ui-theme-preset').value = undefined

    if (import.meta.client) {
      document.getElementById('chat-css-variables')?.replaceChildren()
      document.getElementById('chat-custom-colors')?.replaceChildren()
    }
  }

  return {
    color,
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
    fontSize,
    spacing,
    fonts,
    font,
    icon,
    icons,
    modes,
    mode,
    hasCSSChanges,
    hasConfigChanges,
    configLabel: computed(() => framework.value === 'vue' ? 'vite.config.ts' : 'app.config.ts'),
    currentDoc,
    removeCustomColors,
    removeCSSVariables,
    setStyleUi,
    exportCSS,
    exportConfig,
    applyThemeSettings,
    resetTheme
  }
}
