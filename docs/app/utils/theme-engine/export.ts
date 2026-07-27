import { themeIcons } from '../theme'
import type { ThemeDoc } from './types'
import { DEFAULT_COLORS, THEME_DEFAULTS } from './types'
import { styleComponents, styleTokens, mergeUi, isCustomShadow, BORDER_WIDTH_DEFAULT } from './styles'
import { LIBRARY_TOKEN_DEFAULTS } from './resolve'

/**
 * Generate the minimal `main.css`. The document only holds overrides, so
 * everything present is emitted and nothing else.
 */
export function generateCSS(doc: ThemeDoc): string {
  const lines = [
    '@import "tailwindcss";',
    '@import "@nuxt/ui";'
  ]

  const themeLines: string[] = []
  if (doc.font?.sans && doc.font.sans !== THEME_DEFAULTS.font) {
    themeLines.push(`  --font-sans: '${doc.font.sans}', sans-serif;`)
  }
  // Weight steps are live variables in tailwind v4 — font-medium compiles
  // to font-weight: var(--font-weight-medium) — so remapping them reaches
  // every component, not just inherited text.
  for (const step of ['normal', 'medium', 'semibold', 'bold'] as const) {
    const weight = doc.font?.weights?.[step]
    if (weight !== undefined) {
      themeLines.push(`  --font-weight-${step}: ${weight};`)
    }
  }
  if (doc.spacing !== undefined && doc.spacing !== THEME_DEFAULTS.spacing) {
    themeLines.push(`  --spacing: ${doc.spacing}rem;`)
  }
  // Border width exports as tailwind's default-width theme variables — the
  // consumer's compile scales every bare border/divide/ring utility, far
  // beyond what per-component classes could enumerate. (The live preview
  // can't use this: the variables resolve at compile time.)
  const borderWidth = doc.style?.border === 'none'
    ? 0
    : doc.style?.border && doc.style.border !== 'default' ? doc.style.borderWidth ?? BORDER_WIDTH_DEFAULT : undefined
  // 1px matches tailwind's stock width but still exports: the treatment is an
  // explicit choice, and the variable is what lets an import reconstruct it.
  if (borderWidth !== undefined) {
    themeLines.push(`  --default-border-width: ${borderWidth}px;`)
    themeLines.push(`  --default-ring-width: ${borderWidth}px;`)
  }
  // Redefine the whole shadow ramp as @theme tokens so the consumer's compile
  // rewrites every bare shadow-* utility — the same reach the docs get from
  // gating --shadow-* in main.css, but unconditional here since an export is
  // one fixed theme (no Inherit/Custom toggle to switch between). Custom scales
  // the single config per size (mirrors main.css's .shadow-custom block); None
  // flattens content the way the component fragments already flatten widgets;
  // Inherit emits nothing and leaves Tailwind's native shadows untouched.
  // The per-size geometry scale below must stay in step with main.css. Alpha is
  // uniform (the opacity slider read literally), so size shows through geometry.
  const SHADOW_RAMP = [
    { size: '2xs', s: 0.15 },
    { size: 'xs', s: 0.25 },
    { size: 'sm', s: 0.4 },
    { size: 'md', s: 0.65 },
    { size: 'lg', s: 1 },
    { size: 'xl', s: 1.5 },
    { size: '2xl', s: 2.2 }
  ]
  if (isCustomShadow(doc.style?.shadow)) {
    for (const { size, s } of SHADOW_RAMP) {
      themeLines.push(`  --shadow-${size}: calc(var(--ui-shadow-offset-x) * ${s}) calc(var(--ui-shadow-offset-y) * ${s}) calc(var(--ui-shadow-blur) * ${s}) calc(var(--ui-shadow-spread) * ${s}) color-mix(in oklab, var(--ui-shadow-color) var(--ui-shadow-opacity, 25%), transparent);`)
    }
  } else if (doc.style?.shadow === 'flat') {
    for (const { size } of SHADOW_RAMP) themeLines.push(`  --shadow-${size}: 0 0 transparent;`)
  }
  if (themeLines.length) {
    lines.push('', '@theme {', ...themeLines, '}')
  }

  const colorLines: string[] = []
  for (const [name, palette] of Object.entries(doc.palettes || {})) {
    for (const [shade, color] of Object.entries(palette.shades)) {
      colorLines.push(`  --color-${name}-${shade}: ${color};`)
    }
  }

  if (colorLines.length) {
    lines.push('', '@theme static {', ...colorLines, '}')
  }

  if (doc.fontSize !== undefined && doc.fontSize !== THEME_DEFAULTS.fontSize) {
    lines.push('', 'html {', `  font-size: ${doc.fontSize}px;`, '}')
  }

  // Body-level treatment: classless text has no utility to dereference the
  // weight variable, and case/tracking/leading are inherited properties.
  const bodyLines: string[] = []
  if (doc.font?.weights?.normal !== undefined) bodyLines.push(`  font-weight: ${doc.font.weights.normal};`)
  if (doc.font?.uppercase) bodyLines.push('  text-transform: uppercase;')
  if (doc.font?.italic) bodyLines.push('  font-style: italic;')
  if (doc.font?.letterSpacing !== undefined) bodyLines.push(`  letter-spacing: ${doc.font.letterSpacing}em;`)
  if (doc.font?.lineHeight !== undefined) bodyLines.push(`  line-height: ${doc.font.lineHeight};`)
  if (bodyLines.length) {
    lines.push('', 'body {', ...bodyLines, '}')
  }

  // Headings ride one h1–h6 rule; unset fields inherit the base treatment.
  const heading = doc.font?.heading
  if (heading && Object.keys(heading).length) {
    const headingLines: string[] = []
    if (heading.font) headingLines.push(`  font-family: '${heading.font}', sans-serif;`)
    if (heading.weight !== undefined) headingLines.push(`  font-weight: ${heading.weight};`)
    if (heading.uppercase) headingLines.push('  text-transform: uppercase;')
    if (heading.italic) headingLines.push('  font-style: italic;')
    if (heading.underline) headingLines.push('  text-decoration: underline;')
    if (heading.letterSpacing !== undefined) headingLines.push(`  letter-spacing: ${heading.letterSpacing}em;`)
    if (heading.lineHeight !== undefined) headingLines.push(`  line-height: ${heading.lineHeight};`)
    if (headingLines.length) lines.push('', 'h1, h2, h3, h4, h5, h6 {', ...headingLines, '}')
  }

  const rootLines: string[] = []
  if (doc.radius !== undefined && doc.radius !== THEME_DEFAULTS.radius) {
    rootLines.push(`  --ui-radius: ${doc.radius}rem;`)
  }
  if (doc.blackAsPrimary) {
    rootLines.push('  --ui-primary: black;')
  }

  if (rootLines.length) {
    lines.push('', ':root {', ...rootLines, '}')
  }

  // Color variables behind the style treatment. Hard shadows always need
  // --ui-shadow-color defined; explicit color choices override per mode.
  // Studio-only variables (hand-rolled preview markup) never export.
  const style = styleTokens(doc.style || {})
  for (const mode of ['light', 'dark'] as const) {
    for (const key of Object.keys(style[mode])) {
      if (key.startsWith('--studio-')) Reflect.deleteProperty(style[mode], key)
    }
  }
  // Any shadow treatment defaults the shared color when none was chosen.
  const castsShadow = (value?: string) => !!value && value !== 'none' && value !== 'flat'
  const anyShadow = castsShadow(doc.style?.shadow) || castsShadow(doc.style?.innerShadow)
  if (anyShadow && !style.light['--ui-shadow-color']) {
    style.light['--ui-shadow-color'] = 'var(--ui-color-neutral-950)'
    style.dark['--ui-shadow-color'] = 'black'
  }
  if (isCustomShadow(doc.style?.shadow)) {
    // The custom-shadow classes reference the geometry variables — a
    // standalone export must define them even at default values.
    if (!style.light['--ui-shadow-offset-x']) {
      style.light['--ui-shadow-offset-x'] = '3px'
      style.light['--ui-shadow-offset-y'] = '3px'
      style.light['--ui-shadow-blur'] = '0px'
      style.light['--ui-shadow-spread'] = '0px'
    }
    // The button press-effect's shadow-(--ui-shadow-hard*) utilities read these.
    style.light['--ui-shadow-hard'] = 'var(--ui-shadow-offset-x) var(--ui-shadow-offset-y) var(--ui-shadow-blur) var(--ui-shadow-spread) var(--ui-shadow-final-hard)'
    style.light['--ui-shadow-hard-half'] = 'calc(var(--ui-shadow-offset-x) / 2) calc(var(--ui-shadow-offset-y) / 2) var(--ui-shadow-blur) var(--ui-shadow-spread) var(--ui-shadow-final-hard)'
    style.light['--ui-shadow-final-hard'] = 'color-mix(in oklab, var(--ui-shadow-color) var(--ui-shadow-opacity, 100%), transparent)'
  }
  if (doc.style?.innerShadow && doc.style.innerShadow !== 'none') {
    if (isCustomShadow(doc.style.innerShadow)) {
      if (!style.light['--ui-inner-shadow-offset-x']) {
        style.light['--ui-inner-shadow-offset-x'] = '0px'
        style.light['--ui-inner-shadow-offset-y'] = '2px'
        style.light['--ui-inner-shadow-blur'] = '4px'
        style.light['--ui-inner-shadow-spread'] = '0px'
      }
      style.light['--ui-inner-shadow'] = 'var(--ui-inner-shadow-offset-x) var(--ui-inner-shadow-offset-y) var(--ui-inner-shadow-blur) var(--ui-inner-shadow-spread) var(--ui-shadow-final-inner)'
    }
    style.light['--ui-shadow-final-inner'] = 'color-mix(in oklab, var(--ui-inner-shadow-color, var(--ui-shadow-color)) var(--ui-inner-shadow-opacity, 15%), transparent)'
  }

  // One block per mode: the style expansion and the doc's explicit token
  // overrides merge, explicit values last so they win — a doc whose tokens
  // duplicate the style expansion (older exports round-tripped through
  // import) collapses instead of printing every variable twice.
  const light = { ...style.light, ...doc.tokens?.light }

  const dark: Record<string, string> = {
    ...style.dark,
    ...(doc.blackAsPrimary ? { '--ui-primary': 'white' } : {}),
    ...doc.tokens?.dark
  }
  // The `:root, .light` block matches `<html class="dark">` too (`:root` is
  // unconditional) and lands after the library's `.dark` block, so a token
  // overridden for light only would win the source-order tie in dark mode.
  // Restate the library's dark value so the `.dark` block below wins it back.
  for (const [key, value] of Object.entries(light)) {
    if (key in dark) continue
    const fallback = (LIBRARY_TOKEN_DEFAULTS.dark as Record<string, string>)[key]
    if (fallback && fallback !== value) {
      dark[key] = fallback
    }
  }

  if (Object.keys(light).length) {
    lines.push('', ':root, .light {', ...Object.entries(light).map(([key, val]) => `  ${key}: ${val};`), '}')
  }

  if (Object.keys(dark).length) {
    lines.push('', '.dark {', ...Object.entries(dark).map(([key, val]) => `  ${key}: ${val};`), '}')
  }

  return lines.join('\n')
}

/**
 * Serialize a plain object to JS/TS object-literal source: unquote only keys
 * that are valid identifiers (so dashed keys like `ui-radius` stay quoted and
 * valid), and prefer single-quoted strings — but keep double quotes on any
 * string containing an apostrophe, so a value like `Cooper's` isn't corrupted.
 */
function toObjectSource(value: Record<string, any>): string {
  return JSON.stringify(value, null, 2)
    // Only identifier-safe keys may drop their quotes.
    .replace(/"([a-z_$][\w$]*)":/gi, '$1:')
    // Convert the remaining double-quoted strings (values, dashed keys) to
    // single quotes, but leave any that contain a single quote untouched —
    // double quotes are valid JS and don't need escaping there.
    .replace(/"((?:[^"\\]|\\.)*)"/g, (match, body: string) =>
      body.includes('\'') ? match : `'${body}'`)
}

/** The `app.config.ts` / `vite.config.ts` side of the export. */
export function generateConfig(doc: ThemeDoc, framework: string = 'nuxt'): string {
  const config: Record<string, any> = {}

  const colorEntries = Object.entries(doc.colors || {}).filter(([key, value]) => value !== DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS])
  if (colorEntries.length) {
    config.ui = { colors: Object.fromEntries(colorEntries) }
  }

  if (doc.icons && doc.icons !== THEME_DEFAULTS.icons && doc.icons in themeIcons) {
    config.ui = config.ui || {}
    config.ui.icons = themeIcons[doc.icons as keyof typeof themeIcons]
  }

  // Explicit components merge INTO the style expansion (classes concatenate,
  // explicit last so it wins) — a spread would drop one side wholesale.
  // Width rides the @theme default-width variables in the exported CSS, so
  // the config only carries frame/color/shadow classes.
  const componentOverrides = mergeUi(doc.style ? styleComponents(doc.style) : undefined, doc.components)
  if (Object.keys(componentOverrides).length) {
    config.ui = config.ui || {}
    Object.assign(config.ui, componentOverrides)
  }

  const configString = toObjectSource(config)

  if (framework === 'vue') {
    const pluginConfig = config.ui
      ? toObjectSource({ ui: config.ui })
      : '{}'
    return [
      'import { defineConfig } from \'vite\'',
      'import vue from \'@vitejs/plugin-vue\'',
      'import ui from \'@nuxt/ui/vite\'',
      '',
      `export default defineConfig({`,
      '  plugins: [',
      '    vue(),',
      `    ui(${pluginConfig.split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n')})`,
      '  ]',
      '})'
    ].join('\n')
  }

  return `export default defineAppConfig(${configString})`
}

/**
 * Translate a document into the shape `useTheme().applyThemeSettings()`
 * accepts — the sanitized write path shared with the AI theme feature, which
 * also persists everything to the localStorage keys the FOUC scripts restore.
 */
export function docToSettings(doc: ThemeDoc): Record<string, any> {
  const settings: Record<string, any> = {}

  for (const [alias, palette] of Object.entries(doc.colors || {})) {
    settings[alias] = palette
  }

  if (doc.blackAsPrimary) settings.blackAsPrimary = true
  if (doc.radius !== undefined) settings.radius = doc.radius
  if (doc.fontSize !== undefined) settings.fontSize = doc.fontSize
  if (doc.spacing !== undefined) settings.spacing = doc.spacing
  if (doc.font?.sans) settings.font = doc.font.sans
  if (doc.font?.weights) settings.fontWeights = doc.font.weights
  if (doc.font?.uppercase || doc.font?.italic || doc.font?.letterSpacing !== undefined || doc.font?.lineHeight !== undefined) {
    settings.fontBody = { uppercase: doc.font.uppercase, italic: doc.font.italic, letterSpacing: doc.font.letterSpacing, lineHeight: doc.font.lineHeight }
  }
  if (doc.font?.heading) settings.fontHeading = doc.font.heading
  if (doc.icons) settings.icons = doc.icons

  if (doc.palettes) {
    settings.customColors = Object.fromEntries(
      Object.entries(doc.palettes).map(([name, palette]) => [name, palette.shades])
    )
  }

  // Token overrides plus the style treatment's color variables.
  const style = doc.style ? styleTokens(doc.style) : { light: {}, dark: {} }
  const light = { ...style.light, ...doc.tokens?.light }
  const dark = { ...style.dark, ...doc.tokens?.dark }
  if (Object.keys(light).length || Object.keys(dark).length) {
    settings.cssVariables = {
      ...(Object.keys(light).length ? { light } : {}),
      ...(Object.keys(dark).length ? { dark } : {})
    }
  }

  // Only the doc's explicit components ride the settings channel — the
  // style expansion is applied through the dedicated style-ui channel by
  // the caller (applyDoc), so a later style tweak can't destroy them.
  if (doc.components && Object.keys(doc.components).length) {
    settings.ui = doc.components
  }

  return settings
}
