/**
 * The theme's wire format: `generateCSS`/`generateConfig` emit the minimal
 * `main.css` + `app.config.ts` pair for a doc, `main.ts` with Vue, plus
 * `generateViteConfig` for a Vue icon set. `explicit` writes the headline
 * settings (`primary`, `neutral`, the body font) even at their defaults, for
 * a pane that shows the theme rather than a diff to paste.
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
  // the heading and mono stacks are emitted whatever they are, so the default
  // face still needs importing when it is one of those.
  if (framework === 'vue') {
    const sans = doc.font?.sans ?? THEME_DEFAULTS.font
    const families = [...new Set([
      explicit || sans !== THEME_DEFAULTS.font ? sans : undefined,
      doc.font?.heading,
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
  if (doc.font?.heading) themeLines.push(`  --font-heading: '${doc.font.heading}', var(--font-sans);`)
  if (doc.font?.mono) themeLines.push(`  --font-mono: '${doc.font.mono}', monospace;`)
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

  // Case, tracking and leading are inherited properties with no Nuxt UI
  // variable. These element rules ride `@layer base`: unlayered CSS outranks
  // every layer, so a bare rule here would beat the utilities too and
  // `<body class="tracking-tight">` could not override the tracking. In base
  // they still beat preflight (same layer, later source order) while
  // utilities keep winning.
  const bodyLines: string[] = []
  if (doc.font?.uppercase) bodyLines.push('  text-transform: uppercase;')
  if (doc.font?.italic) bodyLines.push('  font-style: italic;')
  if (doc.font?.letterSpacing !== undefined) bodyLines.push(`  letter-spacing: ${doc.font.letterSpacing}em;`)
  if (doc.font?.lineHeight !== undefined) bodyLines.push(`  line-height: ${doc.font.lineHeight};`)
  if (bodyLines.length) {
    lines.push('', '@layer base {', '  body {', ...bodyLines.map(line => `  ${line}`), '  }', '}')
  }

  const rootLines: string[] = []
  if (doc.font?.weights?.body !== undefined) rootLines.push(`  --ui-font-weight-body: ${doc.font.weights.body};`)
  if (doc.font?.weights?.heading !== undefined) rootLines.push(`  --ui-font-weight-heading: ${doc.font.weights.heading};`)
  if (doc.radius !== undefined && doc.radius !== THEME_DEFAULTS.radius) rootLines.push(`  --ui-radius: ${doc.radius}rem;`)
  if (rootLines.length) {
    lines.push('', ':root {', ...rootLines, '}')
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

/** Indent every line of `source` after the first by `indent`. */
function indentTail(source: string, indent: string): string {
  return source.split('\n').map((line, i) => i === 0 ? line : indent + line).join('\n')
}

/** The icon set of a doc, `undefined` when the theme keeps the default one. */
function iconSet(doc: ThemeDoc): Record<string, string> | undefined {
  if (!doc.icons || doc.icons === THEME_DEFAULTS.icons || !Object.hasOwn(themeIcons, doc.icons)) {
    return undefined
  }
  return themeIcons[doc.icons as keyof typeof themeIcons]
}

/**
 * The `app.config.ts` side of the export, `main.ts` with Vue: the component
 * overrides under `ui`, in the shape of the theme. With Nuxt the icon set goes
 * here too, with Vue it goes to `generateViteConfig`, which bundles it.
 */
export function generateConfig(doc: ThemeDoc, framework: string = 'nuxt', _options: SerializeOptions = {}): string {
  // Explicit components merge INTO the style expansion (classes concatenate,
  // explicit last), a spread would drop one side wholesale.
  const ui: Record<string, any> = { ...mergeUi(doc.style ? styleComponents(doc.style) : undefined, doc.components) }

  if (framework === 'vue') {
    const options = Object.keys(ui).length ? `, ${toObjectSource({ ui })}` : ''
    return [
      'import ui from \'@nuxt/ui/vue-plugin\'',
      '',
      `app.use(ui${options})`
    ].join('\n')
  }

  // last, so the component overrides lead the file
  const icons = iconSet(doc)
  if (icons) {
    ui.icons = icons
  }

  return `export default defineAppConfig(${toObjectSource(Object.keys(ui).length ? { ui } : {})})`
}

/** The Vue icon set, in the `vite.config.ts` that bundles it. Empty with Nuxt or the default icons. */
export function generateViteConfig(doc: ThemeDoc, framework: string = 'nuxt'): string {
  const icons = iconSet(doc)
  if (framework !== 'vue' || !icons) {
    return ''
  }

  return [
    'import { defineConfig } from \'vite\'',
    'import vue from \'@vitejs/plugin-vue\'',
    'import ui from \'@nuxt/ui/vite\'',
    '',
    'export default defineConfig({',
    '  plugins: [',
    '    vue(),',
    `    ui(${indentTail(toObjectSource({ ui: { icons } }), '    ')})`,
    '  ]',
    '})'
  ].join('\n')
}
