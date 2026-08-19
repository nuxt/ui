/**
 * The theme's wire format, both directions.
 *
 * `generateCSS`/`generateConfig` emit the minimal `main.css` +
 * `app.config.ts` pair for a doc; `importTheme` parses that pair back. They
 * are a contract, not two independent modules: any change to what the
 * emitters print needs a matching change to the grammar the parser accepts,
 * or a theme stops round-tripping. They live together so that drift is
 * visible in one diff.
 */
import type { ThemeDoc, Shade, StyleOptions, DefaultVariant, DefaultSize, DefaultColor, VariantGroup } from './types'
import {
  SHADES_ALL,
  DEFAULT_COLORS,
  THEME_DEFAULTS,
  LIBRARY_TOKEN_DEFAULTS,
  styleComponents,
  styleTokens,
  mergeUi,
  VARIANT_GROUPS,
  VARIANT_SUPPORT,
  SIZE_SUPPORT,
  COLOR_SUPPORT
} from './types'
import { themeIcons } from '../icons'

/* ======================================================== emit (export) == */

/** Generate the minimal `main.css`, the doc only holds overrides, so everything present is emitted. */
export function generateCSS(doc: ThemeDoc): string {
  const lines = [
    '@import "tailwindcss";',
    '@import "@nuxt/ui";'
  ]

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

/**
 * Serialize to JS object-literal source: unquote only identifier-safe keys,
 * prefer single-quoted strings, keep double quotes around apostrophes.
 */
function toObjectSource(value: Record<string, any>): string {
  return JSON.stringify(value, null, 2)
    .replace(/"([a-z_$][\w$]*)":/gi, '$1:')
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

/* ====================================================== parse (import) == */

/**
 * The inverse of generateCSS/generateConfig: parse an exported theme back
 * into a ThemeDoc. Anything outside the export grammar is collected in
 * `skipped` and surfaced, never silently dropped.
 */
export interface ThemeImportResult {
  doc: ThemeDoc
  skipped: string[]
}

const SHADE_SET = new Set<number>(SHADES_ALL)

/* ---------------------------------------------------------------- CSS -- */

interface ParsedCSS {
  palettes: Record<string, Partial<Record<Shade, string>>>
  font?: string
  fontSize?: number
  radius?: number
  fontWeights?: { normal?: number, medium?: number, semibold?: number, bold?: number }
  body?: { weight?: number, uppercase?: boolean, italic?: boolean, letterSpacing?: number, lineHeight?: number }
  serif?: string
  mono?: string
  blackAsPrimary?: boolean
  light: Record<string, string>
  dark: Record<string, string>
  skipped: string[]
}

function parseCSS(css: string): ParsedCSS {
  const result: ParsedCSS = { palettes: {}, light: {}, dark: {}, skipped: [] }
  let clean = css.replace(/\/\*[\s\S]*?\*\//g, '')

  // Our own export wraps the element rules in `@layer base` (so utilities can
  // still win); unwrap that one layer so the flat scanner below sees them.
  clean = clean.replace(/@layer\s+base\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g, '$1')

  // The flat block scanner can't see nesting, a nested at-rule's inner
  // blocks would import as GLOBAL tokens. Lift each whole one into `skipped`.
  clean = clean.replace(/@(?:media|supports|container|layer|scope)[^{}]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, (block) => {
    result.skipped.push(block.trim().replace(/\s+/g, ' '))
    return ''
  })

  const blockRe = /([^{}]+)\{([^{}]*)\}/g
  let cursor = 0
  let match: RegExpExecArray | null

  const outside = (text: string) => {
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('@import') && !trimmed.startsWith('@source')) {
        result.skipped.push(trimmed)
      }
    }
  }

  while ((match = blockRe.exec(clean))) {
    cursor = match.index + match[0].length

    // The selector is what follows the last ';'; the rest is preamble.
    const segments = match[1]!.split(';')
    outside(segments.slice(0, -1).join('\n'))
    const selector = segments[segments.length - 1]!.trim().replace(/\s+/g, ' ')
    const declarations = match[2]!.split(';')
      .map(declaration => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const colon = declaration.indexOf(':')
        return [declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim()] as const
      })

    for (const [prop, value] of declarations) {
      if (!parseDeclaration(result, selector, prop, value)) {
        result.skipped.push(`${selector} { ${prop}: ${value} }`)
      }
    }
  }
  outside(clean.slice(cursor))

  return result
}

function parseDeclaration(result: ParsedCSS, selector: string, prop: string, value: string): boolean {
  if (selector === '@theme static' || selector === '@theme') {
    const shade = prop.match(/^--color-(.+)-(\d{2,3})$/)
    if (shade && SHADE_SET.has(Number(shade[2]))) {
      const palette = result.palettes[shade[1]!] ||= {}
      palette[Number(shade[2]) as Shade] = value
      return true
    }
    const stack = prop.match(/^--font-(sans|serif|mono)$/)
    if (stack) {
      const family = value.match(/^'([^']+)'/) || value.match(/^"([^"]+)"/)
      if (family) {
        if (stack[1] === 'sans') result.font = family[1]
        else if (stack[1] === 'serif') result.serif = family[1]
        else result.mono = family[1]
        return true
      }
    }
    const weightStep = prop.match(/^--font-weight-(normal|medium|semibold|bold)$/)
    if (weightStep && /^\d+$/.test(value)) {
      result.fontWeights = { ...result.fontWeights, [weightStep[1]!]: Number(value) }
      return true
    }
    return false
  }

  if (selector === 'html' && prop === 'font-size' && value.endsWith('px')) {
    result.fontSize = Number.parseFloat(value)
    return true
  }

  if (selector === 'body') {
    const body = result.body ||= {}
    if (prop === 'font-weight' && /^\d+$/.test(value)) {
      // generated alongside the normal-weight step, not a separate choice
      body.weight = Number(value)
      return true
    }
    if (prop === 'text-transform' && value === 'uppercase') {
      body.uppercase = true
      return true
    }
    if (prop === 'font-style' && value === 'italic') {
      body.italic = true
      return true
    }
    if (prop === 'letter-spacing' && value.endsWith('em')) {
      body.letterSpacing = Number.parseFloat(value)
      return true
    }
    if (prop === 'line-height' && /^\d+(?:\.\d+)?$/.test(value)) {
      body.lineHeight = Number(value)
      return true
    }
    return false
  }

  // The heading rule only carries the serif stack. `var(--font-serif)` is a
  // no-op (the @theme line already set it); a literal family is an older
  // export, so it lands on serif and keeps round-tripping.
  if (selector === 'h1, h2, h3, h4, h5, h6') {
    if (prop === 'font-family') {
      if (value.includes('var(--font-serif)')) return true
      const family = value.match(/^'([^']+)'/) || value.match(/^"([^"]+)"/)
      if (family) {
        result.serif ||= family[1]
        return true
      }
    }
    return false
  }

  if (selector === ':root') {
    if (prop === '--ui-radius' && value.endsWith('rem')) {
      result.radius = Number.parseFloat(value)
      return true
    }
    if (prop === '--ui-primary' && value === 'black') {
      result.blackAsPrimary = true
      return true
    }
    return false
  }

  // Only custom properties are theme tokens, a plain declaration must
  // surface in `skipped`, not ride the token channel into the re-export.
  if (selector === ':root, .light' || selector === '.light') {
    if (!prop.startsWith('--')) return false
    // studio-internal vars never carry theme meaning
    if (!prop.startsWith('--studio-')) result.light[prop] = value
    return true
  }
  if (selector === '.dark') {
    if (!prop.startsWith('--')) return false
    if (!prop.startsWith('--studio-')) result.dark[prop] = value
    return true
  }

  return false
}

/**
 * Parser for the restricted object-literal grammar generateConfig emits,
 * a tokenizer, not eval, so pasted content can't execute anything.
 */
function parseObjectLiteral(source: string, start: number): { value: any, end: number } {
  let i = start

  const ws = () => {
    while (i < source.length && /[\s,]/.test(source[i]!)) i++
  }

  const parseValue = (): any => {
    ws()
    const ch = source[i]
    if (ch === '{') {
      i++
      const obj: Record<string, any> = {}
      ws()
      while (source[i] !== '}') {
        ws()
        let key: string
        if (source[i] === '\'' || source[i] === '"') {
          key = parseString()
        } else {
          const match = source.slice(i).match(/^[\w$-]+/)
          if (!match) throw new Error(`Unexpected character at ${i}`)
          key = match[0]
          i += key.length
        }
        ws()
        if (source[i] !== ':') throw new Error(`Expected ':' at ${i}`)
        i++
        // Define, not assign: a pasted `__proto__`/`constructor` key must
        // land as an own property, not walk the setter.
        Object.defineProperty(obj, key, {
          value: parseValue(),
          writable: true,
          enumerable: true,
          configurable: true
        })
        ws()
      }
      i++
      return obj
    }
    if (ch === '[') {
      i++
      const array: any[] = []
      ws()
      while (source[i] !== ']') {
        array.push(parseValue())
        ws()
      }
      i++
      return array
    }
    if (ch === '\'' || ch === '"') {
      return parseString()
    }
    const literal = source.slice(i).match(/^(true|false|null|-?\d+(?:\.\d+)?)/)
    if (literal) {
      i += literal[0].length
      if (literal[0] === 'true') return true
      if (literal[0] === 'false') return false
      if (literal[0] === 'null') return null
      return Number(literal[0])
    }
    throw new Error(`Unexpected character '${ch}' at ${i}`)
  }

  const parseString = (): string => {
    const quote = source[i]!
    i++
    let out = ''
    while (i < source.length && source[i] !== quote) {
      if (source[i] === '\\') {
        i++
        // backslash at EOF, don't append out-of-range source[i] ("undefined")
        if (i >= source.length) break
      }
      out += source[i]
      i++
    }
    i++
    return out
  }

  const value = parseValue()
  return { value, end: i }
}

function parseConfig(config: string, skipped: string[]): Record<string, any> | undefined {
  const anchor = config.includes('defineAppConfig(')
    ? config.indexOf('defineAppConfig(') + 'defineAppConfig('.length
    : config.includes('ui(') ? config.indexOf('ui(') + 'ui('.length : -1
  if (anchor === -1) {
    skipped.push('config: no defineAppConfig(…) or ui(…) call found')
    return undefined
  }

  const start = config.indexOf('{', anchor)
  if (start === -1) return {}

  try {
    return parseObjectLiteral(config, start).value
  } catch {
    skipped.push('config: could not parse the object literal')
    return undefined
  }
}

/** Rebuild `defaults` from per-component defaultVariants, group-wise. */
function extractDefaults(components: Record<string, any>): StyleOptions['defaults'] {
  const defaults: { size?: DefaultSize, variants?: Partial<Record<VariantGroup, DefaultVariant>>, colors?: Partial<Record<VariantGroup, DefaultColor>> } = {}

  for (const [group, groupComponents] of Object.entries(VARIANT_GROUPS)) {
    const colors = groupComponents.map(component => components[component]?.defaultVariants?.color)
    const candidate = colors.find(Boolean)
    if (!candidate) continue
    const consistent = groupComponents.every((component, index) =>
      COLOR_SUPPORT.includes(component) ? colors[index] === candidate : colors[index] === undefined
    )
    if (consistent) {
      defaults.colors = { ...defaults.colors, [group]: candidate }
    }
  }

  const sizes = SIZE_SUPPORT.map(component => components[component]?.defaultVariants?.size)
  if (sizes[0] && sizes.every(size => size === sizes[0])) {
    defaults.size = sizes[0]
  }

  for (const [group, groupComponents] of Object.entries(VARIANT_GROUPS)) {
    const variants = groupComponents.map(component => components[component]?.defaultVariants?.variant)
    const candidate = variants.find(Boolean)
    if (!candidate) continue
    // Every component that supports the candidate must carry it; ones that
    // can't express it must carry nothing (that's how the expansion skips).
    const consistent = groupComponents.every((component, index) =>
      VARIANT_SUPPORT[component]?.includes(candidate) ? variants[index] === candidate : variants[index] === undefined
    )
    if (consistent) {
      defaults.variants = { ...defaults.variants, [group]: candidate }
    }
  }

  // A value carried by every group that could express it is an app-wide
  // choice, collapsing keeps re-exports byte-identical to the original.
  const groupValues = new Set(Object.values(defaults.variants || {}))
  if (groupValues.size === 1) {
    const [value] = [...groupValues] as [DefaultVariant]
    const expressible = Object.entries(VARIANT_GROUPS)
      .filter(([, groupComponents]) => groupComponents.some(component => VARIANT_SUPPORT[component]?.includes(value)))
      .map(([group]) => group as VariantGroup)
    if (expressible.every(group => defaults.variants?.[group] === value)) {
      return { variant: value, ...(defaults.size ? { size: defaults.size } : {}), ...(defaults.colors ? { colors: defaults.colors } : {}) }
    }
  }

  return Object.keys(defaults).length ? defaults : undefined
}

/** Remove the fragments the reconstructed style regenerates, only genuinely explicit overrides remain. */
function subtractStyleExpansion(components: Record<string, any>, style: StyleOptions): Record<string, any> {
  const expected = styleComponents(style)
  const remaining: Record<string, any> = {}

  for (const [name, fragment] of Object.entries(components)) {
    const expectedFragment = expected[name] || {}
    const leftover: Record<string, any> = {}

    for (const [slot, classes] of Object.entries((fragment.slots || {}) as Record<string, string>)) {
      const expectedClasses = expectedFragment.slots?.[slot]
      if (expectedClasses === classes) continue
      if (expectedClasses && classes.startsWith(`${expectedClasses} `)) {
        leftover.slots = { ...leftover.slots, [slot]: classes.slice(expectedClasses.length + 1) }
      } else {
        leftover.slots = { ...leftover.slots, [slot]: classes }
      }
    }

    const expectedCompounds = [...(expectedFragment.compoundVariants || [])]
    const compounds = ((fragment.compoundVariants || []) as Array<Record<string, unknown>>).filter((entry) => {
      const index = expectedCompounds.findIndex(candidate => JSON.stringify(candidate) === JSON.stringify(entry))
      if (index === -1) return true
      expectedCompounds.splice(index, 1)
      return false
    })
    if (compounds.length) leftover.compoundVariants = compounds

    const defaultVariants = Object.fromEntries(
      Object.entries((fragment.defaultVariants || {}) as Record<string, string>)
        .filter(([key, value]) => expectedFragment.defaultVariants?.[key] !== value)
    )
    if (Object.keys(defaultVariants).length) leftover.defaultVariants = defaultVariants

    if (Object.keys(leftover).length) remaining[name] = leftover
  }

  return remaining
}

/* -------------------------------------------------------------- entry -- */

export function importTheme(input: { css?: string, config?: string }): ThemeImportResult {
  const skipped: string[] = []
  const doc: ThemeDoc = { version: 1 }

  const css = input.css?.trim() ? parseCSS(input.css) : undefined
  if (css) skipped.push(...css.skipped)

  const parsedConfig = input.config?.trim() ? parseConfig(input.config, skipped) : undefined
  const ui = parsedConfig?.ui && typeof parsedConfig.ui === 'object' ? parsedConfig.ui : {}

  if (ui.colors && typeof ui.colors === 'object') {
    const entries = Object.entries(ui.colors as Record<string, unknown>)
      .filter(([alias, name]) => alias in DEFAULT_COLORS && typeof name === 'string')
    if (entries.length) doc.colors = Object.fromEntries(entries) as ThemeDoc['colors']
  }

  if (ui.icons && typeof ui.icons === 'object') {
    const known = Object.entries(themeIcons).find(([, icons]) => JSON.stringify(icons) === JSON.stringify(ui.icons))
    if (known) {
      doc.icons = known[0]
    } else {
      skipped.push('config: unrecognized icons object')
    }
  }

  const components: Record<string, any> = Object.fromEntries(
    Object.entries(ui).filter(([key]) => key !== 'colors' && key !== 'icons')
  )

  // Everything the style axis still owns comes from the config's
  // `defaultVariants`; the token shades ride the CSS as plain overrides.
  const style: StyleOptions = {}
  const defaults = extractDefaults(components)
  if (defaults) style.defaults = defaults

  const explicit = subtractStyleExpansion(components, style)
  if (Object.keys(explicit).length) doc.components = explicit

  if (Object.values(style).some(value => value !== undefined)) {
    doc.style = style
  }

  if (css) {
    if (Object.keys(css.palettes).length) {
      doc.palettes = Object.fromEntries(Object.entries(css.palettes).map(([name, shades]) => [name, { shades }]))
    }
    // A body weight without theme steps (older exports) reads as normal.
    const weights = css.fontWeights || (css.body?.weight !== undefined ? { normal: css.body.weight } : undefined)
    if (css.font || css.serif || css.mono || weights || css.body) {
      doc.font = {
        ...(css.font ? { sans: css.font } : {}),
        ...(css.serif ? { serif: css.serif } : {}),
        ...(css.mono ? { mono: css.mono } : {}),
        ...(weights ? { weights } : {}),
        ...(css.body?.uppercase ? { uppercase: true } : {}),
        ...(css.body?.italic ? { italic: true } : {}),
        ...(css.body?.letterSpacing !== undefined ? { letterSpacing: css.body.letterSpacing } : {}),
        ...(css.body?.lineHeight !== undefined ? { lineHeight: css.body.lineHeight } : {})
      }
    }
    if (css.fontSize !== undefined) doc.fontSize = css.fontSize
    if (css.radius !== undefined) doc.radius = css.radius
    if (css.blackAsPrimary) {
      doc.blackAsPrimary = true
      // its .dark counterpart is generated, not a token choice
      if (css.dark['--ui-primary'] === 'white') delete css.dark['--ui-primary']
    }
    // The export restates the library's dark default for light-only
    // overrides (source-order tie), generated, not a choice; drop it so the
    // round-trip doesn't grow explicit tokens.
    for (const [key, value] of Object.entries(css.dark)) {
      if (key in css.light && value === (LIBRARY_TOKEN_DEFAULTS.dark as Record<string, string>)[key]) {
        Reflect.deleteProperty(css.dark, key)
      }
    }
    if (Object.keys(css.light).length || Object.keys(css.dark).length) {
      doc.tokens = {
        ...(Object.keys(css.light).length ? { light: css.light } : {}),
        ...(Object.keys(css.dark).length ? { dark: css.dark } : {})
      }
    }
  }

  return { doc, skipped }
}
