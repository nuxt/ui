import { themeIcons } from '../theme'
import type { ThemeDoc } from './types'
import { DEFAULT_COLORS, THEME_DEFAULTS } from './types'
import { styleComponents } from './styles'

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
    for (const [shade, hex] of Object.entries(palette.shades)) {
      colorLines.push(`  --color-${name}-${shade}: ${hex};`)
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

  // The hard-shadow component classes reference this variable.
  if (doc.style?.shadow === 'hard') {
    lines.push(
      '',
      ':root, .light {',
      '  --ui-shadow-color: var(--ui-color-neutral-950);',
      '}',
      '',
      '.dark {',
      '  --ui-shadow-color: black;',
      '}'
    )
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

  const componentOverrides = {
    ...(doc.style ? styleComponents(doc.style) : {}),
    ...(doc.components || {})
  }
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

  if (doc.tokens) {
    settings.cssVariables = doc.tokens
  }

  // Expand the shadow/border treatment into component overrides; explicit
  // per-component overrides win over the expansion.
  const ui = {
    ...(doc.style ? styleComponents(doc.style) : {}),
    ...(doc.components || {})
  }
  if (Object.keys(ui).length) {
    settings.ui = ui
  }

  return settings
}
