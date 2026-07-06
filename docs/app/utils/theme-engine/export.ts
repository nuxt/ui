import { themeIcons } from '../theme'
import type { ThemeDoc } from './types'
import { DEFAULT_COLORS, THEME_DEFAULTS } from './types'
import { styleComponents, styleTokens, mergeUi, BORDER_WIDTH_DEFAULT } from './styles'

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
  if (borderWidth !== undefined && borderWidth !== 1) {
    themeLines.push(`  --default-border-width: ${borderWidth}px;`)
    themeLines.push(`  --default-ring-width: ${borderWidth}px;`)
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
  if (doc.style?.shadow === 'hard') {
    if (!style.light['--ui-shadow-color']) {
      style.light['--ui-shadow-color'] = 'var(--ui-color-neutral-950)'
      style.dark['--ui-shadow-color'] = 'black'
    }
    // The hard-shadow classes reference the geometry variables — a
    // standalone export must define them even at default values.
    if (!style.light['--ui-shadow-offset-x']) {
      style.light['--ui-shadow-offset-x'] = '3px'
      style.light['--ui-shadow-offset-y'] = '3px'
      style.light['--ui-shadow-blur'] = '0px'
      style.light['--ui-shadow-spread'] = '0px'
    }
    // The shadow-(--ui-shadow-hard*) utilities read these compositions.
    style.light['--ui-shadow-hard'] = 'var(--ui-shadow-offset-x) var(--ui-shadow-offset-y) var(--ui-shadow-blur) var(--ui-shadow-spread) var(--ui-shadow-final-hard)'
    style.light['--ui-shadow-hard-lg'] = 'calc(var(--ui-shadow-offset-x) * 1.5) calc(var(--ui-shadow-offset-y) * 1.5) var(--ui-shadow-blur) var(--ui-shadow-spread) var(--ui-shadow-final-hard)'
    style.light['--ui-shadow-hard-sm'] = 'calc(var(--ui-shadow-offset-x) * 0.66) calc(var(--ui-shadow-offset-y) * 0.66) var(--ui-shadow-blur) var(--ui-shadow-spread) var(--ui-shadow-final-hard)'
    style.light['--ui-shadow-hard-half'] = 'calc(var(--ui-shadow-offset-x) / 2) calc(var(--ui-shadow-offset-y) / 2) var(--ui-shadow-blur) var(--ui-shadow-spread) var(--ui-shadow-final-hard)'
  }
  if (doc.style?.shadow && doc.style.shadow !== 'none') {
    if (doc.style.shadow === 'soft' && !style.light['--ui-shadow-color']) {
      style.light['--ui-shadow-color'] = 'var(--ui-color-neutral-950)'
      style.dark['--ui-shadow-color'] = 'black'
    }
    style.light['--ui-shadow-final-hard'] = 'color-mix(in oklab, var(--ui-shadow-color) var(--ui-shadow-opacity, 100%), transparent)'
    style.light['--ui-shadow-final-soft'] = 'color-mix(in oklab, var(--ui-shadow-color) var(--ui-shadow-opacity, 25%), transparent)'
  }

  if (Object.keys(style.light).length) {
    lines.push('', ':root, .light {', ...Object.entries(style.light).map(([key, val]) => `  ${key}: ${val};`), '}')
  }
  if (Object.keys(style.dark).length) {
    lines.push('', '.dark {', ...Object.entries(style.dark).map(([key, val]) => `  ${key}: ${val};`), '}')
  }

  const lightOverrides = Object.entries(doc.tokens?.light || {})
  if (lightOverrides.length) {
    lines.push('', ':root, .light {', ...lightOverrides.map(([key, val]) => `  ${key}: ${val};`), '}')
  }

  const darkLines: string[] = []
  if (doc.blackAsPrimary) {
    darkLines.push('  --ui-primary: white;')
  }
  darkLines.push(...Object.entries(doc.tokens?.dark || {}).map(([key, val]) => `  ${key}: ${val};`))

  if (darkLines.length) {
    lines.push('', '.dark {', ...darkLines, '}')
  }

  return lines.join('\n')
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
  const componentOverrides = mergeUi(doc.style ? styleComponents(doc.style, { widthAsVariables: true }) : undefined, doc.components)
  if (Object.keys(componentOverrides).length) {
    config.ui = config.ui || {}
    Object.assign(config.ui, componentOverrides)
  }

  const configString = JSON.stringify(config, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, '\'')

  if (framework === 'vue') {
    const pluginConfig = config.ui
      ? JSON.stringify({ ui: config.ui }, null, 2)
          .replace(/"([^"]+)":/g, '$1:')
          .replace(/"/g, '\'')
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
