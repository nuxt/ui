import { defu } from 'defu'
import { THEME_TAG_IDS, THEME_STATE_KEYS, THEME_STORAGE_KEYS } from '../utils/theme-keys'
import { useLocalStorage } from '@vueuse/core'
import { themeIcons, cssVariableDefaults, readLocalStorage, FONT_WEIGHT_DEFAULTS } from '../utils/theme'
import { generateCSS, generateConfig, mergeUi, isDefaultStyle, styleTokens, DEFAULT_COLORS, THEME_DEFAULTS, SEMANTIC_ALIASES, LIBRARY_TOKEN_DEFAULTS } from '../utils/theme-engine'
import type { ThemeDoc, ThemePalette } from '../utils/theme-engine'
import { omit } from '#ui/utils'
import colors from 'tailwindcss/colors'

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

export interface FontPrefs {
  weights?: { normal?: number, medium?: number, semibold?: number, bold?: number }
  uppercase?: boolean
  italic?: boolean
  /** Tracking in em. */
  letterSpacing?: number
  /** Unitless line height — 1.5 is the tailwind preflight default. */
  lineHeight?: number
  heading?: { font?: string, weight?: number, uppercase?: boolean, italic?: boolean, underline?: boolean, letterSpacing?: number, lineHeight?: number }
}

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const { track } = useAnalytics()

  // The scale sliders stream through their setters at drag frequency —
  // one analytics event per burst is plenty.
  let trackedAt: number | undefined
  function trackThrottled(...args: Parameters<typeof track>) {
    if (!trackedAt || Date.now() - trackedAt > 2000) {
      trackedAt = Date.now()
      track(...args)
    }
  }
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
    return (colors as any)[neutral]?.[shade] || customColorsData.value[neutral]?.[shade] || (colors as any).slate[shade]
  })
  const cssVariablesData = useState<{ light?: Record<string, string>, dark?: Record<string, string> }>('nuxt-ui-css-variables', () => readLocalStorage('nuxt-ui-css-variables', {}))
  /** The studio's style axis (it owns writes); read here for currentDoc/export. */
  const stylePrefs = useState<ThemeDoc['style']>(THEME_STATE_KEYS.stylePrefs, () => readLocalStorage(THEME_STORAGE_KEYS.style, {}))
  // The storage listener doubles as the SAME-TAB sync channel: useTheme is
  // not a shared composable, so the preset menu's ref and the style
  // renderer's ref only converge through vueuse's storage events. (It also
  // half-syncs across tabs — colors/tokens don't follow — a wart, but
  // disabling it here breaks live updates within one tab.)
  const _radius = useLocalStorage('nuxt-ui-radius', 0.25)
  const _fontSize = useLocalStorage('nuxt-ui-font-size', 16)
  const _spacing = useLocalStorage('nuxt-ui-spacing', 0.25)
  const _font = useLocalStorage('nuxt-ui-font', 'Public Sans')
  const _iconSet = useLocalStorage('nuxt-ui-icons', 'lucide')
  const _blackAsPrimary = useLocalStorage('nuxt-ui-black-as-primary', false)

  /**
   * Typography beyond the base family: body weight plus the heading
   * treatment. One JSON channel (state + storage under the same key) so
   * resetTheme and the FOUC script share it.
   */
  const fontPrefs = useState<FontPrefs>('nuxt-ui-font-prefs', () => readLocalStorage('nuxt-ui-font-prefs', {}))

  function setFontPrefs(next: FontPrefs) {
    // Normalize: defaults are absences, so hasCSSChanges/export stay clean.
    const clean: FontPrefs = {}
    const weights: NonNullable<FontPrefs['weights']> = {}
    for (const step of ['normal', 'medium', 'semibold', 'bold'] as const) {
      const weight = next.weights?.[step]
      if (weight !== undefined && weight !== FONT_WEIGHT_DEFAULTS[step]) weights[step] = weight
    }
    if (Object.keys(weights).length) clean.weights = weights
    if (next.uppercase) clean.uppercase = true
    if (next.italic) clean.italic = true
    if (next.letterSpacing !== undefined && next.letterSpacing !== 0) clean.letterSpacing = next.letterSpacing
    if (next.lineHeight !== undefined && next.lineHeight !== 1.5) clean.lineHeight = next.lineHeight
    const heading = next.heading || {}
    const cleanHeading: NonNullable<FontPrefs['heading']> = {}
    if (heading.font && heading.font !== _font.value) cleanHeading.font = heading.font
    // 700 is the heading resting point (the slider's default position) —
    // storing it would pin the toolbar's B active and pollute exports.
    if (heading.weight !== undefined && heading.weight !== 700) cleanHeading.weight = heading.weight
    if (heading.uppercase) cleanHeading.uppercase = true
    if (heading.italic) cleanHeading.italic = true
    if (heading.underline) cleanHeading.underline = true
    if (heading.letterSpacing !== undefined && heading.letterSpacing !== 0) cleanHeading.letterSpacing = heading.letterSpacing
    // headings natively lead at ~1.25, not the body's 1.5
    if (heading.lineHeight !== undefined && heading.lineHeight !== 1.25) cleanHeading.lineHeight = heading.lineHeight
    if (Object.keys(cleanHeading).length) clean.heading = cleanHeading

    fontPrefs.value = clean
    if (Object.keys(clean).length) {
      window.localStorage.setItem('nuxt-ui-font-prefs', JSON.stringify(clean))
    } else {
      window.localStorage.removeItem('nuxt-ui-font-prefs')
    }
    trackThrottled('Theme Changed', { setting: 'fontPrefs' })
  }

  // taupe/mauve/mist/olive ship with tailwind v4's theme.css but not (yet)
  // the tailwindcss/colors JS export — swatches and fits resolve them from
  // the CSS variables instead.
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
      trackThrottled('Theme Changed', { setting: 'radius', value: option })
    }
  })

  const fontSize = computed({
    get() {
      return _fontSize.value
    },
    set(option) {
      _fontSize.value = option
      trackThrottled('Theme Changed', { setting: 'fontSize', value: option })
    }
  })

  const spacing = computed({
    get() {
      return _spacing.value
    },
    set(option) {
      _spacing.value = option
      trackThrottled('Theme Changed', { setting: 'spacing', value: option })
    }
  })

  const fonts = ['Public Sans', 'Comic Neue', 'DM Sans', 'Geist', 'Inter', 'Poppins', 'Outfit', 'Raleway', 'Roboto']

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
    label: 'Bootstrap',
    icon: 'i-bi-bootstrap',
    value: 'bootstrap'
  }, {
    label: 'Heroicons',
    icon: 'i-simple-icons-tailwindcss',
    value: 'heroicons'
  }, {
    label: 'Iconoir',
    icon: 'i-iconoir-iconoir',
    value: 'iconoir'
  }, {
    label: 'Material Symbols',
    icon: 'i-simple-icons-materialdesign',
    value: 'material'
  }, {
    label: 'Phosphor',
    icon: 'i-ph-phosphor-logo',
    value: 'phosphor'
  }, {
    label: 'Pixelart',
    icon: 'i-pixelarticons-pixelarticons',
    value: 'pixelarticons'
  }, {
    label: 'Remix',
    icon: 'i-ri-remixicon-line',
    value: 'remix'
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
  const fontStyle = computed(() => {
    const parts = [`:root { --font-sans: '${_font.value}', sans-serif; }`]
    const prefs = fontPrefs.value
    const weights = prefs.weights || {}
    const weightVars = (Object.keys(weights) as Array<keyof typeof weights>)
      .map(step => `--font-weight-${step}: ${weights[step]};`)
    if (weightVars.length) {
      parts.push(`:root { ${weightVars.join(' ')} }`)
    }
    const bodyRules: string[] = []
    if (weights.normal !== undefined) bodyRules.push(`font-weight: ${weights.normal};`)
    if (prefs.uppercase) bodyRules.push('text-transform: uppercase;')
    if (prefs.italic) bodyRules.push('font-style: italic;')
    if (prefs.letterSpacing !== undefined) bodyRules.push(`letter-spacing: ${prefs.letterSpacing}em;`)
    if (prefs.lineHeight !== undefined) bodyRules.push(`line-height: ${prefs.lineHeight};`)
    if (bodyRules.length) {
      parts.push(`body { ${bodyRules.join(' ')} }`)
    }
    const heading = prefs.heading
    if (heading && Object.keys(heading).length) {
      const rules: string[] = []
      if (heading.font) rules.push(`font-family: '${heading.font}', sans-serif;`)
      if (heading.weight !== undefined) rules.push(`font-weight: ${heading.weight};`)
      if (heading.uppercase) rules.push('text-transform: uppercase;')
      if (heading.italic) rules.push('font-style: italic;')
      if (heading.underline) rules.push('text-decoration: underline;')
      if (heading.letterSpacing !== undefined) rules.push(`letter-spacing: ${heading.letterSpacing}em;`)
      if (heading.lineHeight !== undefined) rules.push(`line-height: ${heading.lineHeight};`)
      parts.push(`h1, h2, h3, h4, h5, h6 { ${rules.join(' ')} }`)
    }
    return parts.join(' ')
  })
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

  /** Google Fonts stylesheet link for a family (Public Sans is bundled). */
  function fontLink(name: string) {
    return {
      rel: 'stylesheet' as const,
      href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@300;400;500;600;700;800&display=swap`,
      id: `font-${name.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  const link = computed(() => {
    const names = new Set([_font.value, fontPrefs.value.heading?.font].filter((name): name is string => !!name && name !== 'Public Sans'))
    return [...names].map(fontLink)
  })

  const style = [
    { innerHTML: radiusStyle, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: fontSizeStyle, id: 'nuxt-ui-font-size', tagPriority: -2 },
    { innerHTML: spacingStyle, id: 'nuxt-ui-spacing', tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
    { innerHTML: fontStyle, id: 'nuxt-ui-font', tagPriority: -2 },
    { innerHTML: customColorsStyle, id: THEME_TAG_IDS.customColors, tagPriority: -2 },
    { innerHTML: cssVariablesStyle, id: THEME_TAG_IDS.cssVariables, tagPriority: -2 }
  ]

  const hasCSSChanges = computed(() => {
    return _radius.value !== 0.25
      || _fontSize.value !== 16
      || _spacing.value !== 0.25
      || _blackAsPrimary.value
      || _font.value !== 'Public Sans'
      || Object.keys(fontPrefs.value).length > 0
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
    const fontDoc: ThemeDoc['font'] = {
      ...(_font.value !== THEME_DEFAULTS.font ? { sans: _font.value } : {}),
      ...(fontPrefs.value.weights ? { weights: { ...fontPrefs.value.weights } } : {}),
      ...(fontPrefs.value.uppercase ? { uppercase: true } : {}),
      ...(fontPrefs.value.italic ? { italic: true } : {}),
      ...(fontPrefs.value.letterSpacing !== undefined ? { letterSpacing: fontPrefs.value.letterSpacing } : {}),
      ...(fontPrefs.value.lineHeight !== undefined ? { lineHeight: fontPrefs.value.lineHeight } : {}),
      ...(fontPrefs.value.heading ? { heading: { ...fontPrefs.value.heading } } : {})
    }
    if (Object.keys(fontDoc).length) doc.font = fontDoc
    if (_iconSet.value !== THEME_DEFAULTS.icons) doc.icons = _iconSet.value

    // Only palettes actually referenced by an alias belong in the export —
    // leftovers from a previous custom palette would bloat the @theme block.
    // Reference by the alias's CURRENT value, not just overrides: a custom
    // palette can shadow a default name (AI retunes 'green' while primary
    // stays 'green') and must still export.
    const referenced = new Set(Object.values(appConfig.ui.colors as Record<string, string>))
    const paletteEntries = Object.entries(customColorsData.value).filter(([name]) => referenced.has(name))
    if (paletteEntries.length) {
      doc.palettes = Object.fromEntries(paletteEntries.map(([name, shades]) => [name, { shades: shades as ThemePalette['shades'] }]))
    }

    // The studio's style prefs, read from the shared reactive state (the
    // studio owns writes) so callers watching currentDoc() re-run on style
    // edits — a raw localStorage read here would be invisible to reactivity.
    const style = stylePrefs.value
    if (!isDefaultStyle(style)) {
      doc.style = style
    }

    // Diff against the LIBRARY defaults, not the docs baseline — the export
    // must reproduce the preview on top of a stock @nuxt/ui install.
    // Studio-only vars (hand-rolled preview markup) stay out of exports.
    // The style treatment's variables live in this channel too (the studio
    // applies them there for the live preview) — but doc.style already
    // accounts for them, so tokens only keep values that DIVERGE from the
    // style expansion.
    const styleVars = doc.style ? styleTokens(doc.style) : { light: {}, dark: {} }
    const light = Object.fromEntries(Object.entries(cssVariablesData.value.light || {}).filter(([key, val]) => !key.startsWith('--studio-') && val !== LIBRARY_TOKEN_DEFAULTS.light[key as keyof typeof LIBRARY_TOKEN_DEFAULTS.light] && val !== (styleVars.light as Record<string, string>)[key]))
    const dark = Object.fromEntries(Object.entries(cssVariablesData.value.dark || {}).filter(([key, val]) => !key.startsWith('--studio-') && val !== LIBRARY_TOKEN_DEFAULTS.dark[key as keyof typeof LIBRARY_TOKEN_DEFAULTS.dark] && val !== (styleVars.dark as Record<string, string>)[key]))
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

    return doc
  }

  // Pure generation — callers track 'Theme Exported' on the actual copy,
  // so opening the export modal doesn't inflate the metric.
  function exportCSS(): string {
    return generateCSS(currentDoc())
  }

  function exportConfig(): string {
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
        document.getElementById(THEME_TAG_IDS.cssVariables)?.replaceChildren()
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
    if (settings.fontWeights !== undefined || settings.fontBody !== undefined || settings.fontHeading !== undefined) {
      const heading = settings.fontHeading && typeof settings.fontHeading === 'object' ? settings.fontHeading : {}
      const rawWeights = settings.fontWeights && typeof settings.fontWeights === 'object' ? settings.fontWeights : fontPrefs.value.weights || {}
      const weights: NonNullable<FontPrefs['weights']> = {}
      for (const step of ['normal', 'medium', 'semibold', 'bold'] as const) {
        const weight = Number(rawWeights[step])
        if (Number.isFinite(weight)) weights[step] = Math.min(900, Math.max(100, weight))
      }
      const body = settings.fontBody && typeof settings.fontBody === 'object' ? settings.fontBody : {}
      const em = (value: unknown) => Number.isFinite(Number(value)) ? Math.min(1, Math.max(-0.2, Number(value))) : undefined
      const leading = (value: unknown) => Number.isFinite(Number(value)) ? Math.min(3, Math.max(0.8, Number(value))) : undefined
      setFontPrefs({
        weights,
        uppercase: !!body.uppercase,
        italic: !!body.italic,
        letterSpacing: em(body.letterSpacing),
        lineHeight: leading(body.lineHeight),
        heading: {
          font: heading.font && SAFE_NAME.test(heading.font) ? heading.font : undefined,
          weight: Number.isFinite(Number(heading.weight)) ? Math.min(900, Math.max(100, Number(heading.weight))) : undefined,
          uppercase: !!heading.uppercase,
          italic: !!heading.italic,
          underline: !!heading.underline,
          letterSpacing: em(heading.letterSpacing),
          lineHeight: leading(heading.lineHeight)
        }
      })
    }
    if (settings.icons && settings.icons in themeIcons) icon.value = settings.icons
    if (settings.blackAsPrimary !== undefined) setBlackAsPrimary(!!settings.blackAsPrimary)

    const colorKeys = SEMANTIC_ALIASES
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
        // Skip `colors` (handled above), `icons` (the reload path skips it
        // too — a partial map would blank icons app-wide) and
        // prototype-chain keys that would pollute appConfig.ui when assigned.
        if (key === 'colors' || key === 'icons' || key === '__proto__' || key === 'constructor' || key === 'prototype') continue

        savedExtras.ui[key] = defu(value as Record<string, any>, savedExtras.ui[key] || {})
      }
    }

    // Only rewrite the channel when this call actually touched it — style
    // sliders and curve drags stream through here and must not re-persist
    // (or reactively wake) the AI extras every tick.
    const touchedExtras = settings.ui || colorKeys.some(color => settings[color] && SAFE_NAME.test(settings[color]))
    if (touchedExtras) {
      aiThemeExtras.value = savedExtras
      window.localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))
    }
    if (settings.ui) {
      recomposeComponentOverrides(Object.keys(savedExtras.ui || {}))
    }

    // Hot paths (style sliders, curve drags at ~16Hz) opt out; only real
    // entry points (AI chat, presets) should emit an analytics event.
    if (options.track !== false) {
      track('AI Theme Applied')
    }
  }

  // applyDoc resets before applying — without the opt-out every preset,
  // import, shuffle and undo/redo would count as a "Theme Reset".
  function resetTheme(options: { track?: boolean, immediate?: boolean } = {}) {
    if (options.track !== false) {
      track('Theme Reset')
    }

    appConfig.ui.colors.primary = 'green'
    window.localStorage.removeItem('nuxt-ui-primary')

    appConfig.ui.colors.neutral = 'slate'
    window.localStorage.removeItem('nuxt-ui-neutral')

    _radius.value = 0.25
    _fontSize.value = 16
    _spacing.value = 0.25
    _font.value = 'Public Sans'
    fontPrefs.value = {}
    window.localStorage.removeItem('nuxt-ui-font-prefs')
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
    window.localStorage.removeItem(THEME_STORAGE_KEYS.preset)
    window.localStorage.removeItem(THEME_STORAGE_KEYS.style)
    window.localStorage.removeItem(THEME_STORAGE_KEYS.paletteParams)
    useState<Record<string, any>>(THEME_STATE_KEYS.stylePrefs).value = {}
    useState<string | undefined>(THEME_STATE_KEYS.themePreset).value = undefined
    // The in-memory curve params too — the storage key alone leaves the
    // palette editor showing (and re-persisting) supposedly-reset curves.
    useState<Record<string, any>>(THEME_STATE_KEYS.paletteParams).value = {}

    // Clearing the live <style> tags imperatively makes a bare reset take
    // effect on the same frame. But when a reset is immediately followed by a
    // re-apply (applyDoc: preset swap, undo/redo), that cleared frame paints as
    // the default theme first — a white flash. Those callers pass immediate:
    // false so the reactive customColors/cssVariables state ({} → new value in
    // one tick) swaps the tags atomically with no intermediate paint.
    if (import.meta.client && options.immediate !== false) {
      document.getElementById(THEME_TAG_IDS.cssVariables)?.replaceChildren()
      document.getElementById(THEME_TAG_IDS.customColors)?.replaceChildren()
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
    fontPrefs,
    setFontPrefs,
    icon,
    icons,
    modes,
    mode,
    hasCSSChanges,
    hasConfigChanges,
    configLabel: computed(() => framework.value === 'vue' ? 'vite.config.ts' : 'app.config.ts'),
    currentDoc,
    cssVariablesData,
    customColorsData,
    removeCustomColors,
    removeCSSVariables,
    setStyleUi,
    exportCSS,
    exportConfig,
    applyThemeSettings,
    resetTheme
  }
}
