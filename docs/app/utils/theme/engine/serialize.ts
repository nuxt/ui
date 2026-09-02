/**
 * The theme's wire format: `generateCSS`/`generateConfig` emit the minimal
 * `main.css` + `app.config.ts` pair for a doc.
 */
import type { ThemeDoc } from './types'
import {
  DEFAULT_COLORS,
  THEME_DEFAULTS,
  LIBRARY_TOKEN_DEFAULTS,
  styleComponents,
  styleTokens,
  mergeUi
} from './types'
import json5 from 'json5'
import { themeIcons } from '../icons'

/* ======================================================== emit (export) == */

/** Generate the minimal `main.css`, the doc only holds overrides, so everything present is emitted. */
export function generateCSS(doc: ThemeDoc): string {
  const lines = [
    '@import "tailwindcss";',
    '@import "@nuxt/ui";'
  ]

  // The faces the doc names have to load from somewhere: the studio pulls
  // them at runtime (loadFontPreviews), an export has only this file.
  const families = [...new Set([doc.font?.sans, doc.font?.serif, doc.font?.mono]
    .filter((name): name is string => !!name && name !== THEME_DEFAULTS.font))]
  for (const family of families) {
    lines.push(`@import url("https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800&display=swap");`)
  }

  const themeLines: string[] = []
  if (doc.font?.sans && doc.font.sans !== THEME_DEFAULTS.font) {
    themeLines.push(`  --font-sans: '${doc.font.sans}', sans-serif;`)
  }
  // Tailwind's own stacks: setting them is all `font-serif` / `font-mono` need.
  if (doc.font?.serif) themeLines.push(`  --font-serif: '${doc.font.serif}', serif;`)
  if (doc.font?.mono) themeLines.push(`  --font-mono: '${doc.font.mono}', monospace;`)
  // Weight steps are live variables in tailwind v4, so remapping them
  // reaches every component, not just inherited text.
  for (const step of ['normal', 'medium', 'semibold', 'bold'] as const) {
    const weight = doc.font?.weights?.[step]
    if (weight !== undefined) {
      themeLines.push(`  --font-weight-${step}: ${weight};`)
    }
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
    lines.push('', '@layer base {', '  html {', `    font-size: ${doc.fontSize}px;`, '  }', '}')
  }

  // Classless text has no utility to dereference the weight variable, and
  // case/tracking/leading are inherited properties. These element rules ride
  // `@layer base`: unlayered CSS outranks every layer, so a bare rule here
  // would beat the utilities too and `<h1 class="font-mono">` could not
  // override the heading family. In base they still beat preflight (same
  // layer, later source order) while utilities keep winning.
  const bodyLines: string[] = []
  if (doc.font?.weights?.normal !== undefined) bodyLines.push(`  font-weight: ${doc.font.weights.normal};`)
  if (doc.font?.uppercase) bodyLines.push('  text-transform: uppercase;')
  if (doc.font?.italic) bodyLines.push('  font-style: italic;')
  if (doc.font?.letterSpacing !== undefined) bodyLines.push(`  letter-spacing: ${doc.font.letterSpacing}em;`)
  if (doc.font?.lineHeight !== undefined) bodyLines.push(`  line-height: ${doc.font.lineHeight};`)
  if (bodyLines.length) {
    lines.push('', '@layer base {', '  body {', ...bodyLines.map(line => `  ${line}`), '  }', '}')
  }

  // Sans and mono ride tailwind's preflight (`--default-font-family` and
  // `--default-mono-font-family`), so neither needs a rule. Nothing consumes
  // `--font-serif`, so headings get this one, emitted only when a serif is
  // set: without the guard, picking just a sans would drop every heading to
  // Georgia. A stopgap until v5's `--ui-font-heading`.
  if (doc.font?.serif) {
    lines.push('', '/* until v5 ships --ui-font-heading */', '@layer base {', '  h1, h2, h3, h4, h5, h6 {', '    font-family: var(--font-serif);', '  }', '}')
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

  // Semantic token shades behind the style choices.
  const style = styleTokens(doc.style || {})
  // Style expansion and explicit token overrides merge, explicit last so a
  // round-tripped doc collapses instead of printing every variable twice.
  const light = { ...style.light, ...doc.tokens?.light }

  const dark: Record<string, string> = {
    ...style.dark,
    ...(doc.blackAsPrimary ? { '--ui-primary': 'white' } : {}),
    ...doc.tokens?.dark
  }
  // `:root, .light` matches `<html class="dark">` too and lands after the
  // library's `.dark` block, so a light-only override would win in dark mode.
  // Restate the library's dark value so the `.dark` block wins it back.
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

/** Serialize to JS object-literal source, like the docs' code panes do. */
function toObjectSource(value: Record<string, any>): string {
  return json5.stringify(value, { space: 2, quote: '\'' }).replace(/,([ \t\n]+[}\]])/g, '$1')
}

/** The `app.config.ts` / `vite.config.ts` side of the export. */
export function generateConfig(doc: ThemeDoc, framework: string = 'nuxt'): string {
  const config: Record<string, any> = {}

  const colorEntries = Object.entries(doc.colors || {}).filter(([key, value]) => value !== DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS])
  if (colorEntries.length) {
    config.ui = { colors: Object.fromEntries(colorEntries) }
  }

  if (doc.icons && doc.icons !== THEME_DEFAULTS.icons && Object.hasOwn(themeIcons, doc.icons)) {
    config.ui = config.ui || {}
    config.ui.icons = themeIcons[doc.icons as keyof typeof themeIcons]
  }

  // Explicit components merge INTO the style expansion (classes concatenate,
  // explicit last), a spread would drop one side wholesale.
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
 * Translate a document into the shape `applyThemeSettings()` accepts, the
 * sanitized write path shared with the AI theme feature.
 */
export function docToSettings(doc: ThemeDoc): Record<string, any> {
  const settings: Record<string, any> = {}

  for (const [alias, palette] of Object.entries(doc.colors || {})) {
    settings[alias] = palette
  }

  if (doc.blackAsPrimary) settings.blackAsPrimary = true
  if (doc.radius !== undefined) settings.radius = doc.radius
  if (doc.fontSize !== undefined) settings.fontSize = doc.fontSize
  if (doc.font?.sans) settings.fontSans = doc.font.sans
  if (doc.font?.serif) settings.fontSerif = doc.font.serif
  if (doc.font?.mono) settings.fontMono = doc.font.mono
  if (doc.font?.weights) settings.fontWeights = doc.font.weights
  if (doc.font?.uppercase || doc.font?.italic || doc.font?.letterSpacing !== undefined || doc.font?.lineHeight !== undefined) {
    settings.fontBody = { uppercase: doc.font.uppercase, italic: doc.font.italic, letterSpacing: doc.font.letterSpacing, lineHeight: doc.font.lineHeight }
  }
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

  // Only explicit components ride the settings channel, the style expansion
  // goes through the dedicated style-ui channel (applyDoc).
  if (doc.components && Object.keys(doc.components).length) {
    settings.ui = doc.components
  }

  return settings
}
