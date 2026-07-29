import { defu } from 'defu'
import { THEME_TAG_IDS, THEME_STATE_KEYS, themeStorageKeys } from '../utils/theme-keys'
import { useLocalStorage } from '@vueuse/core'
import { themeIcons, cssVariableDefaults, readLocalStorage, themeCssBaseline, FONT_WEIGHT_DEFAULTS } from '../utils/theme'
import { generateCSS, generateConfig, mergeUi, isDefaultStyle, styleTokens, DEFAULT_COLORS, THEME_DEFAULTS, SEMANTIC_ALIASES, LIBRARY_TOKEN_DEFAULTS } from '../utils/theme-engine'
import type { ThemeDoc, ThemePalette } from '../utils/theme-engine'
import { omit } from '#ui/utils'
import colors from 'tailwindcss/colors'

// AI `applyTheme` output is untrusted and gets concatenated into <style> rules —
// this is the single write boundary, so only CSS-safe tokens may persist.
const SAFE_NAME = /^[\w -]{1,50}$/
const SAFE_HEX = /^#[0-9a-f]{3,8}$/i
// the engine's canonical shade format: `oklch(62.3% 0.214 259.815)`
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

  // sliders stream through setters at drag frequency — one event per burst
  let trackedAt: number | undefined
  function trackThrottled(...args: Parameters<typeof track>) {
    if (!trackedAt || Date.now() - trackedAt > 2000) {
      trackedAt = Date.now()
      track(...args)
    }
  }
  const { framework } = useFrameworks()

  // the consuming app's localStorage namespace (state keys stay per-app)
  const storageKeys = themeStorageKeys()

  const aiThemeExtras = useState<Record<string, any>>(THEME_STATE_KEYS.aiTheme, () => readLocalStorage(storageKeys.aiTheme, {}))
  // style-treatment bundles live in their OWN channel so restyling can never
  // destroy preset/AI overrides sharing the same component keys
  const styleUiData = useState<Record<string, any>>(THEME_STATE_KEYS.styleUi, () => readLocalStorage(storageKeys.styleUi, {}))
  const customColorsData = useState<Record<string, Record<string, string>>>(THEME_STATE_KEYS.customColors, () => readLocalStorage(storageKeys.customColors, {}))

  // The neutral may be a custom palette with no tailwindcss/colors entry —
  // a throw here would abort the whole unhead flush.
  const color = computed(() => {
    const neutral = appConfig.ui.colors.neutral
    // match the page background (docs light baseline is neutral-50, not white)
    const shade = colorMode.value === 'dark' ? 900 : 50
    return (colors as any)[neutral]?.[shade] || customColorsData.value[neutral]?.[shade] || (colors as any).slate[shade]
  })
  const cssVariablesData = useState<{ light?: Record<string, string>, dark?: Record<string, string> }>(THEME_STATE_KEYS.cssVariables, () => readLocalStorage(storageKeys.cssVariables, {}))
  /** The studio's style axis (it owns writes); read here for currentDoc/export. */
  const stylePrefs = useState<ThemeDoc['style']>(THEME_STATE_KEYS.stylePrefs, () => readLocalStorage(storageKeys.style, {}))
  // The host app's resting theme is the studio's zero point: CSS knobs read
  // from the live styles, config from app.config before the persisted restore
  // mutates it (useState carries the server's pristine capture across).
  const cssBaseline = themeCssBaseline()
  const configBaseline = useState('nuxt-ui-config-baseline', () => ({
    primary: appConfig.ui.colors.primary,
    neutral: appConfig.ui.colors.neutral
  }))

  // useTheme is not a shared composable — separate instances of these refs
  // only converge through vueuse's storage events, so the listener stays on
  const _radius = useLocalStorage(storageKeys.radius, cssBaseline.radius)
  const _fontSize = useLocalStorage(storageKeys.fontSize, cssBaseline.fontSize)
  const _spacing = useLocalStorage(storageKeys.spacing, cssBaseline.spacing)
  const _font = useLocalStorage(storageKeys.font, cssBaseline.font)
  const _iconSet = useLocalStorage(storageKeys.icons, 'lucide')
  const _blackAsPrimary = useLocalStorage(storageKeys.blackAsPrimary, false)

  /** Typography beyond the base family — one JSON channel shared with the FOUC script. */
  const fontPrefs = useState<FontPrefs>(THEME_STATE_KEYS.fontPrefs, () => readLocalStorage(storageKeys.fontPrefs, {}))

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
    // 700 is the heading resting point — storing it would pollute exports
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
      window.localStorage.setItem(storageKeys.fontPrefs, JSON.stringify(clean))
    } else {
      window.localStorage.removeItem(storageKeys.fontPrefs)
    }
    trackThrottled('Theme Changed', { setting: 'fontPrefs' })
  }

  // taupe/mauve/mist/olive ship in tailwind's theme.css but not (yet) the
  // tailwindcss/colors JS export — swatches resolve them from CSS variables
  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
  const neutral = computed({
    get() {
      return appConfig.ui.colors.neutral
    },
    set(option) {
      appConfig.ui.colors.neutral = option
      window.localStorage.setItem(storageKeys.neutral, appConfig.ui.colors.neutral)
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
      window.localStorage.setItem(storageKeys.primary, appConfig.ui.colors.primary)
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

  // Untouched knobs emit no override, so the host app's own CSS shows through.
  const radiusStyle = computed(() => _radius.value !== cssBaseline.radius ? `:root { --ui-radius: ${_radius.value}rem; }` : ':root {}')
  // font-size scales every rem metric; --spacing is tailwind's base density unit
  const fontSizeStyle = computed(() => _fontSize.value !== cssBaseline.fontSize ? `html { font-size: ${_fontSize.value}px; }` : 'html {}')
  const spacingStyle = computed(() => _spacing.value !== cssBaseline.spacing ? `:root { --spacing: ${_spacing.value}rem; }` : ':root {}')
  const blackAsPrimaryStyle = computed(() => _blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
  const fontStyle = computed(() => {
    // fonts hydrate unvalidated from localStorage — re-assert SAFE_NAME at
    // the sink so a tampered name can't break out of the quoted string
    const safeFont = SAFE_NAME.test(_font.value) ? _font.value : cssBaseline.font
    const parts = safeFont !== cssBaseline.font ? [`:root { --font-sans: '${safeFont}', sans-serif; }`] : []
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
      if (heading.font && SAFE_NAME.test(heading.font)) rules.push(`font-family: '${heading.font}', sans-serif;`)
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
    // non-empty sentinel: unhead won't patch an emptied innerHTML, leaving
    // the FOUC-written tag stale after a reactive-only reset (immediate: false)
    if (!entries.length) return ':root {}'
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
    // same sentinel rationale as customColorsStyle
    return parts.length ? parts.join(' ') : ':root {}'
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
    return _radius.value !== cssBaseline.radius
      || _fontSize.value !== cssBaseline.fontSize
      || _spacing.value !== cssBaseline.spacing
      || _blackAsPrimary.value
      || _font.value !== cssBaseline.font
      || Object.keys(fontPrefs.value).length > 0
      || hasCustomColors.value
      || hasCSSVariables.value
  })

  const hasConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== configBaseline.value.primary
      || appConfig.ui.colors.neutral !== configBaseline.value.neutral
      || _iconSet.value !== 'lucide'
      || !!aiThemeExtras.value.colors
      || !!aiThemeExtras.value.ui
  })

  /** Snapshot the live theme state as a sparse ThemeDoc — the export generators' input. */
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

    // Only alias-referenced palettes export. Reference by CURRENT value, not
    // overrides — a custom palette can shadow a default name and must still export.
    const referenced = new Set(Object.values(appConfig.ui.colors as Record<string, string>))
    const paletteEntries = Object.entries(customColorsData.value).filter(([name]) => referenced.has(name))
    if (paletteEntries.length) {
      doc.palettes = Object.fromEntries(paletteEntries.map(([name, shades]) => [name, { shades: shades as ThemePalette['shades'] }]))
    }

    // read from reactive state, not localStorage, so watchers re-run on style edits
    const style = stylePrefs.value
    if (!isDefaultStyle(style)) {
      doc.style = style
    }

    // Diff against LIBRARY defaults (exports sit on a stock install), drop
    // studio-only vars, and keep only values that diverge from the style
    // expansion — doc.style already accounts for the rest.
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

  /**
   * The live theme as a reactive ThemeDoc — the host-facing change feed.
   * Watch it to persist edits wherever they belong (account data, a
   * backend); feed a saved doc back through useThemeStudio().applyDoc()
   * to restore. ThemeStudioButton re-emits this as its `change` event.
   */
  const themeDoc = computed(() => currentDoc())

  // pure generation — callers track 'Theme Exported' on the actual copy
  function exportCSS(): string {
    return generateCSS(currentDoc())
  }

  function exportConfig(): string {
    return generateConfig(currentDoc(), framework.value)
  }

  function injectCustomColors(customColors: Record<string, Record<string, string>>) {
    const merged = { ...customColorsData.value, ...customColors }
    customColorsData.value = merged
    window.localStorage.setItem(storageKeys.customColors, JSON.stringify(merged))
  }

  function removeCSSVariables(keys: { light?: string[], dark?: string[] }) {
    const next = {
      light: Object.fromEntries(Object.entries(cssVariablesData.value.light || {}).filter(([key]) => !keys.light?.includes(key))),
      dark: Object.fromEntries(Object.entries(cssVariablesData.value.dark || {}).filter(([key]) => !keys.dark?.includes(key)))
    }
    cssVariablesData.value = next
    if (Object.keys(next.light).length || Object.keys(next.dark).length) {
      window.localStorage.setItem(storageKeys.cssVariables, JSON.stringify(next))
    } else {
      window.localStorage.removeItem(storageKeys.cssVariables)
      if (import.meta.client) {
        document.getElementById(THEME_TAG_IDS.cssVariables)?.replaceChildren()
      }
    }
  }

  /**
   * Rebuild `appConfig.ui.<component>` for the given keys: style bundle
   * first, preset/AI extras last so explicit overrides win the class merge.
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
      window.localStorage.setItem(storageKeys.styleUi, JSON.stringify(ui))
    } else {
      window.localStorage.removeItem(storageKeys.styleUi)
    }
    recomposeComponentOverrides(touched)
  }

  function removeCustomColors(names: string[]) {
    const remaining = Object.fromEntries(Object.entries(customColorsData.value).filter(([name]) => !names.includes(name)))
    customColorsData.value = remaining
    if (Object.keys(remaining).length) {
      window.localStorage.setItem(storageKeys.customColors, JSON.stringify(remaining))
    } else {
      window.localStorage.removeItem(storageKeys.customColors)
    }
  }

  function injectCSSVariables(cssVariables: { light?: Record<string, string>, dark?: Record<string, string> }) {
    const merged = {
      light: { ...cssVariablesData.value.light, ...cssVariables.light },
      dark: { ...cssVariablesData.value.dark, ...cssVariables.dark }
    }
    cssVariablesData.value = merged
    window.localStorage.setItem(storageKeys.cssVariables, JSON.stringify(merged))
  }

  function applyThemeSettings(settings: Record<string, any>, options: { track?: boolean } = {}) {
    // sanitize up front — later checks must consult the SANITIZED set
    const safeCustomColors = settings.customColors && typeof settings.customColors === 'object'
      ? sanitizeCustomColors(settings.customColors)
      : {}
    if (Object.keys(safeCustomColors).length) injectCustomColors(safeCustomColors)

    if (settings.cssVariables && typeof settings.cssVariables === 'object') {
      injectCSSVariables(sanitizeCSSVariables(settings.cssVariables))
    }

    if (settings.primary && SAFE_NAME.test(settings.primary)) primary.value = settings.primary
    // any known palette is a valid neutral, custom ones included
    if (settings.neutral && SAFE_NAME.test(settings.neutral) && (neutralColors.includes(settings.neutral) || primaryColors.includes(settings.neutral) || (customColorsData.value[settings.neutral] || safeCustomColors[settings.neutral]))) neutral.value = settings.neutral
    if (settings.radius !== undefined && Number.isFinite(Number(settings.radius))) radius.value = Number(settings.radius)
    // clamped: these scale the whole page
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
        // skip colors (handled above), icons (a partial map would blank
        // icons app-wide) and prototype-polluting keys
        if (key === 'colors' || key === 'icons' || key === '__proto__' || key === 'constructor' || key === 'prototype') continue

        savedExtras.ui[key] = defu(value as Record<string, any>, savedExtras.ui[key] || {})
      }
    }

    // only rewrite the channel when touched — slider/curve drags stream
    // through here and must not reactively wake the AI extras every tick
    const touchedExtras = settings.ui || colorKeys.some(color => settings[color] && SAFE_NAME.test(settings[color]))
    if (touchedExtras) {
      aiThemeExtras.value = savedExtras
      window.localStorage.setItem(storageKeys.aiTheme, JSON.stringify(savedExtras))
    }
    if (settings.ui) {
      recomposeComponentOverrides(Object.keys(savedExtras.ui || {}))
    }

    // hot paths (slider/curve drags) opt out of the analytics event
    if (options.track !== false) {
      track('AI Theme Applied')
    }
  }

  // track opt-out: applyDoc resets before applying — every preset swap and
  // undo/redo would otherwise count as a "Theme Reset"
  function resetTheme(options: { track?: boolean, immediate?: boolean } = {}) {
    if (options.track !== false) {
      track('Theme Reset')
    }

    appConfig.ui.colors.primary = configBaseline.value.primary
    window.localStorage.removeItem(storageKeys.primary)

    appConfig.ui.colors.neutral = configBaseline.value.neutral
    window.localStorage.removeItem(storageKeys.neutral)

    _radius.value = cssBaseline.radius
    _fontSize.value = cssBaseline.fontSize
    _spacing.value = cssBaseline.spacing
    _font.value = cssBaseline.font
    fontPrefs.value = {}
    window.localStorage.removeItem(storageKeys.fontPrefs)
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
    window.localStorage.removeItem(storageKeys.aiTheme)
    window.localStorage.removeItem(storageKeys.customColors)
    window.localStorage.removeItem(storageKeys.cssVariables)
    aiThemeExtras.value = {}
    customColorsData.value = {}
    cssVariablesData.value = {}

    // studio-owned state resets too — orphaned style prefs would silently
    // resurrect on the next style click or export
    setStyleUi({})
    window.localStorage.removeItem(storageKeys.preset)
    window.localStorage.removeItem(storageKeys.style)
    window.localStorage.removeItem(storageKeys.paletteParams)
    useState<Record<string, any>>(THEME_STATE_KEYS.stylePrefs).value = {}
    useState<string | undefined>(THEME_STATE_KEYS.themePreset).value = undefined
    // in-memory curve params too, or the palette editor re-persists them
    useState<Record<string, any>>(THEME_STATE_KEYS.paletteParams).value = {}

    // Imperative clearing makes a bare reset land the same frame — but a
    // reset-then-reapply (preset swap, undo/redo) would flash the default
    // theme, so those callers pass immediate: false and let reactivity swap
    // the tags atomically.
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
    themeDoc,
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
