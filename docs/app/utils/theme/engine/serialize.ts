/**
 * The theme's wire format: `generateCSS`/`generateApp` emit the minimal
 * `main.css` + `app.vue` pair for a doc, plus `generateConfig` when the icon
 * set changes. `explicit` writes the headline settings (`primary`, `neutral`,
 * the body font) even at their defaults, for a pane that shows the theme
 * rather than a diff to paste.
 */
export interface SerializeOptions {
  explicit?: boolean
}
import type { ThemeDoc } from './types'
import {
  DEFAULT_COLORS,
  THEME_DEFAULTS,
  LIBRARY_TOKEN_DEFAULTS,
  TOKEN_SHADE_TARGETS,
  tokenShadeDefaults,
  styleComponents,
  styleTokens,
  mergeUi
} from './types'
import json5 from 'json5'
import { themeIcons } from '../icons'

/* ======================================================== emit (export) == */

/** Generate the minimal `main.css`, the doc only holds overrides, so everything present is emitted. */
export function generateCSS(doc: ThemeDoc, framework: string = 'nuxt', { explicit = false }: SerializeOptions = {}): string {
  const lines = [
    '@import "tailwindcss";',
    '@import "@nuxt/ui";'
  ]

  // Semantic token shades behind the style choices.
  const style = styleTokens(doc.style || {})
  // Style expansion and explicit token overrides merge, explicit last so a
  // round-tripped doc collapses instead of printing every variable twice.
  const light: Record<string, string> = { ...style.light, ...doc.tokens?.light }
  const dark: Record<string, string> = { ...style.dark, ...doc.tokens?.dark }

  // An alias pinned to other shades of its own palette goes on its plugin line,
  // `primary: neutral 900 200`, instead of a variable
  const aliasShades: Record<string, string> = {}
  for (const alias of Object.keys(DEFAULT_COLORS)) {
    const token = `--ui-${alias}`
    const shadeOf = (value?: string) => value === 'black' || value === 'white' ? value : value?.match(new RegExp(`^var\\(--ui-color-${alias}-(\\d+)\\)$`))?.[1]
    const lightShade = shadeOf(light[token])
    const darkShade = shadeOf(dark[token])
    if ((!lightShade && !darkShade) || (light[token] && !lightShade) || (dark[token] && !darkShade)) continue
    // A mode left unset keeps the alias's default shade
    const defaults = tokenShadeDefaults(token)
    const shades = [lightShade ?? String(defaults.light), darkShade ?? String(defaults.dark)]
    aliasShades[alias] = shades.join(' ')
    Reflect.deleteProperty(light, token)
    Reflect.deleteProperty(dark, token)
  }

  // Only the aliases that differ from the defaults, plus `primary` and `neutral`
  // when `explicit`, the two a theme is read by
  const colorEntries = Object.entries(doc.colors || {}).filter(([key, value]) => value !== DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS])
  const changed = Object.fromEntries(colorEntries)
  const colorAliases = Object.fromEntries(Object.entries({ ...DEFAULT_COLORS, ...changed })
    .filter(([key]) => key in changed || key in aliasShades || (explicit && (key === 'primary' || key === 'neutral')))
    .map(([key, value]) => [key, aliasShades[key] ? `${value} ${aliasShades[key]}` : value]))
  if (Object.keys(colorAliases).length) {
    lines.push('', '@plugin "@nuxt/ui/colors" {', ...Object.entries(colorAliases).map(([key, value]) => `  ${key}: ${value};`), '}')
  }

  // Nuxt resolves the `--font-*` variables below through @nuxt/fonts and
  // self-hosts the faces, so an import there would load each one twice. The
  // Vite plugin ships no fonts integration, so that export fetches them from
  // Google. The families are not the doc's verbatim: `--font-sans` is only
  // named when it differs from the default or the export is explicit, while
  // serif and mono are emitted whatever they are, so the default face still
  // needs importing when it is one of those.
  if (framework === 'vue') {
    const sans = doc.font?.sans ?? THEME_DEFAULTS.font
    const families = [...new Set([
      explicit || sans !== THEME_DEFAULTS.font ? sans : undefined,
      doc.font?.serif,
      doc.font?.mono
    ].filter((name): name is string => !!name))]
    for (const family of families) {
      lines.push(`@import url("https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800&display=swap");`)
    }
  }

  const themeLines: string[] = []
  if (explicit || (doc.font?.sans && doc.font.sans !== THEME_DEFAULTS.font)) {
    themeLines.push(`  --font-sans: '${doc.font?.sans ?? THEME_DEFAULTS.font}', sans-serif;`)
  }
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

  if (doc.radius !== undefined && doc.radius !== THEME_DEFAULTS.radius) {
    lines.push('', ':root {', `  --ui-radius: ${doc.radius}rem;`, '}')
  }

  // `:root, .light` matches `<html class="dark">` too and lands after the
  // library's `.dark` block, so a light-only override would win in dark mode.
  // Restate the library's dark value so the `.dark` block wins it back, or
  // `initial` for a token the library leaves unset, like a color's text.
  for (const [key, value] of Object.entries(light)) {
    if (key in dark) continue
    const fallback = LIBRARY_TOKEN_DEFAULTS.dark[key] ?? (TOKEN_SHADE_TARGETS.some(target => target.token === key && target.follows) ? 'initial' : undefined)
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

/**
 * The `app.vue` side of the export: a `<UTheme>` around `<UApp>`, so overlays
 * and toasts take the theme too. Its `ui` holds the slot classes, `variants`
 * the variant classes and `props` the default variants, `'*'` for the app-wide
 * size and color. The icon set goes to `generateConfig` instead.
 */
export function generateApp(doc: ThemeDoc, framework: string = 'nuxt', _options: SerializeOptions = {}): string {
  const theme: Record<string, Record<string, any>> = {}
  // `path` is the component's key, or `['prose', 'p']` for a prose child
  const set = (prop: string, path: string[], value: unknown) => {
    if (!value || typeof value !== 'object' || !Object.keys(value).length) return
    let target = (theme[prop] ||= {})
    for (const key of path.slice(0, -1)) target = (target[key] ||= {})
    target[path.at(-1)!] = value
  }
  const add = (path: string[], override: Record<string, any>) => {
    set('ui', path, override.slots)
    set('variants', path, override.variants)
    set('props', path, override.defaultVariants)
  }

  // Explicit components merge INTO the style expansion (classes concatenate,
  // explicit last), a spread would drop one side wholesale.
  const overrides = mergeUi(doc.style ? styleComponents(doc.style) : undefined, doc.components)
  for (const [component, override] of Object.entries(overrides)) {
    if (component === 'defaultVariants') {
      set('props', ['*'], override)
    } else if (component === 'prose') {
      for (const [child, childOverride] of Object.entries(override as Record<string, any>)) {
        if (childOverride && typeof childOverride === 'object') add(['prose', child], childOverride)
      }
    } else {
      add([component], override)
    }
  }

  const props = (['ui', 'variants', 'props'] as const).filter(prop => theme[prop])
  const page = framework === 'vue' ? '<RouterView />' : '<NuxtPage />'
  const app = ['<UApp>', `  ${page}`, '</UApp>']

  if (!props.length) {
    return ['<template>', ...app.map(line => `  ${line}`), '</template>'].join('\n')
  }

  return [
    '<script setup lang="ts">',
    // `as const` keeps `color: 'neutral'` a literal, a `string` fails the prop types
    props.map(prop => `const ${prop} = ${toObjectSource(theme[prop]!)}${prop === 'props' ? ' as const' : ''}`).join('\n\n'),
    '</script>',
    '',
    '<template>',
    `  <UTheme ${props.map(prop => `:${prop}="${prop}"`).join(' ')}>`,
    ...app.map(line => `    ${line}`),
    '  </UTheme>',
    '</template>'
  ].join('\n')
}

/**
 * The icon set, empty when the theme keeps the default one. It stays in the
 * app config rather than on `<UTheme>`, the only place ContentSearch and
 * `error.vue` read icons from.
 */
export function generateConfig(doc: ThemeDoc, framework: string = 'nuxt'): string {
  if (!doc.icons || doc.icons === THEME_DEFAULTS.icons || !Object.hasOwn(themeIcons, doc.icons)) {
    return ''
  }

  const config = { ui: { icons: themeIcons[doc.icons as keyof typeof themeIcons] } }

  if (framework === 'vue') {
    return [
      'import { defineConfig } from \'vite\'',
      'import vue from \'@vitejs/plugin-vue\'',
      'import ui from \'@nuxt/ui/vite\'',
      '',
      'export default defineConfig({',
      '  plugins: [',
      '    vue(),',
      `    ui(${toObjectSource(config).split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n')})`,
      '  ]',
      '})'
    ].join('\n')
  }

  return `export default defineAppConfig(${toObjectSource(config)})`
}
