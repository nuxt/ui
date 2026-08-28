import { defu } from 'defu'
import { THEME_TAG_IDS, THEME_STATE_KEYS } from '../utils/theme/storage'
import type { FontPrefs } from '../utils/theme/storage'
import { FONT_WEIGHT_DEFAULTS, FONTS, RADIUSES, NEUTRAL_COLORS, PRIMARY_COLORS } from '../utils/theme/studio'
import { themeIcons, ICON_PACKS } from '../utils/theme/icons'
import { cssVariableDefaults } from '../utils/theme/tokens'
import { SAFE_NAME, sanitizeCustomColors, sanitizeCSSVariables } from '../utils/theme/sanitize'
import { generateCSS, generateConfig, mergeUi, isDefaultStyle, isDefaultTheme, styleTokens, DEFAULT_COLORS, THEME_DEFAULTS, SEMANTIC_ALIASES, LIBRARY_TOKEN_DEFAULTS } from '../utils/theme/engine'
import type { ThemeDoc, ThemePalette, StyleOptions, StoredPaletteParams } from '../utils/theme/engine'
import colors from 'tailwindcss/colors'

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const { track, trackThrottled } = useAnalytics()
  const { framework } = useFrameworks()

  // Defaults only. The saved theme is ASSIGNED by plugins/theme.ts on the
  // client, never seeded here: the server renders this composable, so these
  // keys are already in the SSR payload and an initializer would not re-run.
  // That plugin also owns the single write (see utils/theme/storage.ts), so
  // nothing in here touches localStorage.
  const aiThemeExtras = useState<Record<string, any>>('nuxt-ui-ai-theme', () => ({}))
  // Style-treatment bundles live in their OWN channel so restyling can never
  // destroy preset/AI overrides sharing the same component keys. Derived from
  // `stylePrefs`, so it is rebuilt on load rather than persisted.
  const styleUiData = useState<Record<string, any>>('nuxt-ui-style-ui', () => ({}))
  const customColorsData = useState<Record<string, Record<string, string>>>('nuxt-ui-custom-colors', () => ({}))

  // The neutral may be a custom palette with no tailwindcss/colors entry,
  // a throw here would abort the whole unhead flush.
  const color = computed(() => {
    const neutral = appConfig.ui.colors.neutral
    // match the page background (docs light baseline is neutral-50, not white)
    const shade = colorMode.value === 'dark' ? 900 : 50
    return (colors as any)[neutral]?.[shade] || customColorsData.value[neutral]?.[shade] || (colors as any).slate[shade]
  })
  const cssVariablesData = useState<{ light?: Record<string, string>, dark?: Record<string, string> }>('nuxt-ui-css-variables', () => ({}))

  // The studio's three channels are declared here with the rest of the
  // persisted state, so one reset covers the whole document. useThemeStudio
  // owns every write to them.
  /** Default variants and token shades, expanded into the style-ui bundle. */
  const stylePrefs = useState<StyleOptions>(THEME_STATE_KEYS.stylePrefs, () => ({}))
  /** The preset the per-section dirty and reset comparisons measure against. */
  const activePreset = useState<string | undefined>(THEME_STATE_KEYS.themePreset, () => undefined)
  /** The palette editor's curves and pins, the source its custom ramps derive from. */
  const paletteParams = useState<Partial<Record<string, StoredPaletteParams>>>(THEME_STATE_KEYS.paletteParams, () => ({}))
  // useState, not useLocalStorage: these are app-level, so every useTheme call
  // shares one ref directly instead of converging through storage events.
  const _radius = useState('nuxt-ui-radius', () => THEME_DEFAULTS.radius as number)
  const _fontSize = useState('nuxt-ui-font-size', () => THEME_DEFAULTS.fontSize as number)
  const _iconSet = useState('nuxt-ui-icons', () => THEME_DEFAULTS.icons as string)
  const _blackAsPrimary = useState('nuxt-ui-black-as-primary', () => false)

  /**
   * The whole font document in one JSON channel, shared with the FOUC script.
   * Sparse, exactly like `ThemeDoc['font']` it is typed as: an absent field
   * means "inherit", so a stock theme stores nothing.
   */
  const fontPrefs = useState<FontPrefs>('nuxt-ui-font', () => ({}))

  function setFontPrefs(next: FontPrefs, options: { track?: boolean } = {}) {
    // Normalize: defaults are absences, so hasChanges/export stay clean.
    const clean: FontPrefs = {}
    if (next.sans && next.sans !== THEME_DEFAULTS.font) clean.sans = next.sans
    if (next.serif) clean.serif = next.serif
    if (next.mono) clean.mono = next.mono
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

    fontPrefs.value = clean
    if (options.track !== false) trackThrottled('Theme Changed', { setting: 'fontPrefs' })
  }

  const neutral = computed({
    get() {
      return appConfig.ui.colors.neutral
    },
    set(option) {
      appConfig.ui.colors.neutral = option
      track('Theme Changed', { setting: 'neutral', value: option })
    }
  })

  const primary = computed({
    get() {
      return appConfig.ui.colors.primary
    },
    set(option) {
      appConfig.ui.colors.primary = option
      setBlackAsPrimary(false)
      track('Theme Changed', { setting: 'primary', value: option })
    }
  })

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

  /** The body family, the `sans` field of the font document. */
  const font = computed({
    get() {
      return fontPrefs.value.sans ?? THEME_DEFAULTS.font
    },
    set(option) {
      setFontPrefs({ ...fontPrefs.value, sans: option }, { track: false })
      track('Theme Changed', { setting: 'font', value: option })
    }
  })

  // The saved pack is client-only, so anything rendered FROM it, the studio
  // chrome, a picker's own brand glyph, would differ from the server on the
  // first client render, and Vue only warns about a mismatched class, it never
  // patches it. Reporting the stock pack until mounted keeps that first render
  // honest; the flip afterwards is an ordinary update, which does repaint.
  // Writes are unaffected, and `_iconSet` stays ungated for dirty checks.
  const iconMounted = ref(false)
  onMounted(() => (iconMounted.value = true))

  const icon = computed({
    get() {
      return iconMounted.value ? _iconSet.value : 'lucide'
    },
    set(option) {
      _iconSet.value = option
      appConfig.ui.icons = themeIcons[option as keyof typeof themeIcons] as any
      track('Theme Changed', { setting: 'icons', value: option })
    }
  })

  const blackAsPrimary = computed(() => _blackAsPrimary.value)

  function setBlackAsPrimary(value: boolean) {
    _blackAsPrimary.value = value
    if (value) {
      track('Theme Changed', { setting: 'primary', value: 'black' })
    }
  }

  const radiusStyle = computed(() => `:root { --ui-radius: ${_radius.value}rem; }`)
  // font-size scales every rem-based metric on the page
  const fontSizeStyle = computed(() => _fontSize.value !== 16 ? `html { font-size: ${_fontSize.value}px; }` : 'html {}')
  const blackAsPrimaryStyle = computed(() => _blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
  const fontStyle = computed(() => {
    // fonts hydrate unvalidated from localStorage, re-assert SAFE_NAME at
    // the sink so a tampered name can't break out of the quoted string
    const prefs = fontPrefs.value
    const safeFont = prefs.sans && SAFE_NAME.test(prefs.sans) ? prefs.sans : 'Public Sans'
    const parts = [`:root { --font-sans: '${safeFont}', sans-serif; }`]
    // The stacks themselves, so `font-serif` / `font-mono` follow the theme.
    if (prefs.serif && SAFE_NAME.test(prefs.serif)) parts.push(`:root { --font-serif: '${prefs.serif}', serif; }`)
    if (prefs.mono && SAFE_NAME.test(prefs.mono)) parts.push(`:root { --font-mono: '${prefs.mono}', monospace; }`)
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
    // No element rules here: preflight points `code`/`kbd`/`pre`/`samp` at
    // --font-mono, and the h1–h6 rule that reads --font-serif lives in
    // main.css, inside `@layer base` so `font-mono` on a heading still wins.
    // Injected here it would be unlayered, and outrank every utility.
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
    // Same guard as fontStyle's, so a name the stylesheet refuses can't still
    // cost a Google Fonts request.
    const names = new Set([fontPrefs.value.sans, fontPrefs.value.serif, fontPrefs.value.mono].filter((name): name is string => !!name && name !== 'Public Sans' && SAFE_NAME.test(name)))
    return [...names].map(fontLink)
  })

  const style = [
    { innerHTML: radiusStyle, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: fontSizeStyle, id: 'nuxt-ui-font-size', tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
    { innerHTML: fontStyle, id: 'nuxt-ui-font', tagPriority: -2 },
    { innerHTML: customColorsStyle, id: THEME_TAG_IDS.customColors, tagPriority: -2 },
    { innerHTML: cssVariablesStyle, id: THEME_TAG_IDS.cssVariables, tagPriority: -2 }
  ]

  /** Anything to export: the live theme diverges from a stock install. */
  const hasChanges = computed(() => !isDefaultTheme(currentDoc()))

  /** Snapshot the live theme state as a sparse ThemeDoc, the export generators' input. */
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
    // setFontPrefs already normalized this to the doc's own sparse shape,
    // so it only needs copying out of the reactive object.
    const fontDoc: ThemeDoc['font'] = {
      ...fontPrefs.value,
      ...(fontPrefs.value.weights ? { weights: { ...fontPrefs.value.weights } } : {})
    }
    if (Object.keys(fontDoc).length) doc.font = fontDoc
    if (_iconSet.value !== THEME_DEFAULTS.icons) doc.icons = _iconSet.value

    // Only alias-referenced palettes export. Reference by CURRENT value, not
    // overrides, a custom palette can shadow a default name and must still export.
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
    // expansion, doc.style already accounts for the rest.
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

  // pure generation, callers track 'Theme Exported' on the actual copy
  function exportCSS(): string {
    return generateCSS(currentDoc())
  }

  function exportConfig(): string {
    return generateConfig(currentDoc(), framework.value)
  }

  function injectCustomColors(customColors: Record<string, Record<string, string>>) {
    customColorsData.value = { ...customColorsData.value, ...customColors }
  }

  function removeCSSVariables(keys: { light?: string[], dark?: string[] }) {
    const next = {
      light: Object.fromEntries(Object.entries(cssVariablesData.value.light || {}).filter(([key]) => !keys.light?.includes(key))),
      dark: Object.fromEntries(Object.entries(cssVariablesData.value.dark || {}).filter(([key]) => !keys.dark?.includes(key)))
    }
    cssVariablesData.value = next
    if (import.meta.client && !Object.keys(next.light).length && !Object.keys(next.dark).length) {
      document.getElementById(THEME_TAG_IDS.cssVariables)?.replaceChildren()
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
    recomposeComponentOverrides(touched)
  }

  function removeCustomColors(names: string[]) {
    customColorsData.value = Object.fromEntries(Object.entries(customColorsData.value).filter(([name]) => !names.includes(name)))
  }

  function injectCSSVariables(cssVariables: { light?: Record<string, string>, dark?: Record<string, string> }) {
    const merged = {
      light: { ...cssVariablesData.value.light, ...cssVariables.light },
      dark: { ...cssVariablesData.value.dark, ...cssVariables.dark }
    }
    cssVariablesData.value = merged
  }

  function applyThemeSettings(settings: Record<string, any>, options: { track?: boolean } = {}) {
    // sanitize up front, later checks must consult the SANITIZED set
    const safeCustomColors = settings.customColors && typeof settings.customColors === 'object'
      ? sanitizeCustomColors(settings.customColors)
      : {}
    if (Object.keys(safeCustomColors).length) injectCustomColors(safeCustomColors)

    if (settings.cssVariables && typeof settings.cssVariables === 'object') {
      injectCSSVariables(sanitizeCSSVariables(settings.cssVariables))
    }

    if (settings.primary && SAFE_NAME.test(settings.primary)) primary.value = settings.primary
    // any known palette is a valid neutral, custom ones included
    if (settings.neutral && SAFE_NAME.test(settings.neutral) && (NEUTRAL_COLORS.includes(settings.neutral) || PRIMARY_COLORS.includes(settings.neutral) || (customColorsData.value[settings.neutral] || safeCustomColors[settings.neutral]))) neutral.value = settings.neutral
    // clamped like the FOUC script clamps it, or a reload would repaint a different value
    if (settings.radius !== undefined && Number.isFinite(Number(settings.radius))) radius.value = Math.min(4, Math.max(0, Number(settings.radius)))
    // clamped: these scale the whole page
    if (settings.fontSize !== undefined && Number.isFinite(Number(settings.fontSize))) fontSize.value = Math.min(20, Math.max(12, Number(settings.fontSize)))
    // All three stacks and the body treatment share one channel, so they are
    // applied in one pass: setFontPrefs takes the WHOLE object, and any field
    // the payload leaves out has to fall back to what is already set. A
    // payload naming only the heading font would otherwise clear the rest,
    // the body family included.
    if (settings.fontSans !== undefined || settings.fontSerif !== undefined || settings.fontMono !== undefined
      || settings.fontWeights !== undefined || settings.fontBody !== undefined) {
      const current = fontPrefs.value
      const rawWeights = settings.fontWeights && typeof settings.fontWeights === 'object' ? settings.fontWeights : current.weights || {}
      const weights: NonNullable<FontPrefs['weights']> = {}
      for (const step of ['normal', 'medium', 'semibold', 'bold'] as const) {
        const weight = Number(rawWeights[step])
        if (Number.isFinite(weight)) weights[step] = Math.min(900, Math.max(100, weight))
      }
      const body = settings.fontBody && typeof settings.fontBody === 'object' ? settings.fontBody : undefined
      const em = (value: unknown) => Number.isFinite(Number(value)) ? Math.min(1, Math.max(-0.2, Number(value))) : undefined
      const leading = (value: unknown) => Number.isFinite(Number(value)) ? Math.min(3, Math.max(0.8, Number(value))) : undefined
      // Absent OR unusable keeps what is set: a rejected name must not read
      // as "clear this slot".
      const family = (value: unknown, fallback?: string) =>
        typeof value === 'string' && SAFE_NAME.test(value) ? value : fallback
      setFontPrefs({
        sans: family(settings.fontSans, current.sans),
        serif: family(settings.fontSerif, current.serif),
        mono: family(settings.fontMono, current.mono),
        weights,
        uppercase: body ? !!body.uppercase : current.uppercase,
        italic: body ? !!body.italic : current.italic,
        letterSpacing: body ? em(body.letterSpacing) : current.letterSpacing,
        lineHeight: body ? leading(body.lineHeight) : current.lineHeight
      })
    }
    if (settings.icons && Object.hasOwn(themeIcons, settings.icons)) icon.value = settings.icons
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

    // only rewrite the channel when touched, slider/curve drags stream
    // through here and must not reactively wake the AI extras every tick
    const touchedExtras = settings.ui || colorKeys.some(color => settings[color] && SAFE_NAME.test(settings[color]))
    if (touchedExtras) {
      aiThemeExtras.value = savedExtras
    }
    if (settings.ui) {
      recomposeComponentOverrides(Object.keys(savedExtras.ui || {}))
    }

    // hot paths (slider/curve drags) opt out of the analytics event
    if (options.track !== false) {
      track('AI Theme Applied')
    }
  }

  // track opt-out: applyDoc resets before applying, every preset swap and
  // undo/redo would otherwise count as a "Theme Reset"
  function resetTheme(options: { track?: boolean, immediate?: boolean } = {}) {
    if (options.track !== false) {
      track('Theme Reset')
    }

    appConfig.ui.colors.primary = DEFAULT_COLORS.primary
    appConfig.ui.colors.neutral = DEFAULT_COLORS.neutral

    _radius.value = THEME_DEFAULTS.radius
    _fontSize.value = THEME_DEFAULTS.fontSize
    fontPrefs.value = {}
    _iconSet.value = THEME_DEFAULTS.icons
    appConfig.ui.icons = themeIcons.lucide as any
    _blackAsPrimary.value = false

    const extras = aiThemeExtras.value
    if (extras.colors) {
      for (const key of Object.keys(extras.colors)) {
        (appConfig.ui.colors as any)[key] = DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS] || (appConfig.ui.colors as any)[key]
      }
    }
    if (extras.ui) {
      for (const key of Object.keys(extras.ui)) {
        if (key === 'colors' || key === 'icons') continue
        (appConfig.ui as any)[key] = undefined
      }
    }
    aiThemeExtras.value = {}
    customColorsData.value = {}
    cssVariablesData.value = {}

    // the studio channels too: orphaned style prefs would silently resurrect
    // on the next style click or export, and orphaned curve params would be
    // re-persisted by the palette editor
    setStyleUi({})
    stylePrefs.value = {}
    activePreset.value = undefined
    paletteParams.value = {}

    // Imperative clearing makes a bare reset land the same frame, but a
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
    neutralColors: NEUTRAL_COLORS,
    neutral,
    primaryColors: PRIMARY_COLORS,
    primary,
    blackAsPrimary,
    setBlackAsPrimary,
    radiuses: RADIUSES,
    radius,
    fontSize,
    fonts: FONTS,
    font,
    fontPrefs,
    setFontPrefs,
    icon,
    icons: ICON_PACKS,
    hasChanges,
    configLabel: computed(() => framework.value === 'vue' ? 'vite.config.ts' : 'app.config.ts'),
    currentDoc,
    cssVariablesData,
    customColorsData,
    stylePrefs,
    activePreset,
    paletteParams,
    removeCustomColors,
    removeCSSVariables,
    setStyleUi,
    exportCSS,
    exportConfig,
    applyThemeSettings,
    resetTheme
  }
}
