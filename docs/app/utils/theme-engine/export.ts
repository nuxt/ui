import { themeIcons } from '../theme'
import type { ThemeDoc } from './types'
import { DEFAULT_COLORS, THEME_DEFAULTS } from './types'
import { styleComponents, styleTokens, mergeUi } from './styles'

/**
 * Generate the minimal `main.css`. The document only holds overrides, so
 * everything present is emitted and nothing else.
 */
export function generateCSS(doc: ThemeDoc): string {
  const lines = [
    '@import "tailwindcss";',
    '@import "@nuxt/ui";'
  ]

  if (doc.font?.sans && doc.font.sans !== THEME_DEFAULTS.font) {
    lines.push('', '@theme {', `  --font-sans: '${doc.font.sans}', sans-serif;`, '}')
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
  const style = styleTokens(doc.style || {})
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
  const componentOverrides = mergeUi(doc.style ? styleComponents(doc.style) : undefined, doc.components)
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
