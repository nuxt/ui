import type { ThemeDoc, Shade } from './types'
import { SHADES, DEFAULT_COLORS } from './types'
import type { StyleOptions, DefaultVariant, DefaultSize, VariantGroup } from './styles'
import {
  styleComponents,
  FRAME_COLOR_VALUES,
  SHADOW_COLOR_VALUES,
  SHADOW_GEOMETRY_DEFAULTS,
  BORDER_WIDTH_DEFAULT,
  VARIANT_GROUPS,
  VARIANT_SUPPORT,
  SIZE_SUPPORT
} from './styles'
import { parseUiColorRef } from './resolve'
import { themeIcons } from '../theme'

/**
 * The inverse of generateCSS/generateConfig: parse an exported (or
 * export-shaped) theme back into a ThemeDoc, so pasting a theme is as
 * first-class as copying one out. Anything outside the export grammar is
 * collected in `skipped` and surfaced — never silently dropped.
 */
export interface ThemeImportResult {
  doc: ThemeDoc
  skipped: string[]
}

const SHADE_SET = new Set<number>(SHADES)

/* ---------------------------------------------------------------- CSS -- */

interface ParsedCSS {
  palettes: Record<string, Partial<Record<Shade, string>>>
  font?: string
  spacing?: number
  fontSize?: number
  radius?: number
  blackAsPrimary?: boolean
  light: Record<string, string>
  dark: Record<string, string>
  skipped: string[]
}

function parseCSS(css: string): ParsedCSS {
  const result: ParsedCSS = { palettes: {}, light: {}, dark: {}, skipped: [] }
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')

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

    // Everything before the selector's own line (@import lines, stray text)
    // is preamble — the selector is what follows the last ';'.
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
    if (prop === '--font-sans') {
      const family = value.match(/^'([^']+)'/) || value.match(/^"([^"]+)"/)
      if (family) {
        result.font = family[1]
        return true
      }
    }
    if (prop === '--spacing' && value.endsWith('rem')) {
      result.spacing = Number.parseFloat(value)
      return true
    }
    return false
  }

  if (selector === 'html' && prop === 'font-size' && value.endsWith('px')) {
    result.fontSize = Number.parseFloat(value)
    return true
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
    if (prop === '--spacing' && value.endsWith('rem')) {
      result.spacing = Number.parseFloat(value)
      return true
    }
    return false
  }

  if (selector === ':root, .light' || selector === '.light') {
    result.light[prop] = value
    return true
  }
  if (selector === '.dark') {
    result.dark[prop] = value
    return true
  }

  return false
}

/* ------------------------------------------------- style reconstruction -- */

/**
 * Pull the style-owned variables out of the per-mode records (consuming
 * them) and work backwards to the StyleOptions that would emit them.
 * What remains in light/dark afterwards is plain token overrides.
 */
function extractStyle(light: Record<string, string>, dark: Record<string, string>): StyleOptions {
  const style: StyleOptions = {}

  const take = (prop: string): { light?: string, dark?: string } => {
    const value = { light: light[prop], dark: dark[prop] }
    Reflect.deleteProperty(light, prop)
    Reflect.deleteProperty(dark, prop)
    return value
  }

  const opacity = take('--ui-shadow-opacity')
  const geometry = {
    x: take('--ui-shadow-offset-x'),
    y: take('--ui-shadow-offset-y'),
    blur: take('--ui-shadow-blur'),
    spread: take('--ui-shadow-spread')
  }
  const finals = { hard: take('--ui-shadow-final-hard'), soft: take('--ui-shadow-final-soft') }
  const shadowColor = take('--ui-shadow-color')
  const frameColor = take('--ui-frame-color')

  if (geometry.x.light !== undefined) {
    style.shadow = 'hard'
    const parsed = {
      x: Number.parseFloat(geometry.x.light),
      y: Number.parseFloat(geometry.y.light ?? '3'),
      blur: Number.parseFloat(geometry.blur.light ?? '0'),
      spread: Number.parseFloat(geometry.spread.light ?? '0')
    }
    // The export force-emits default geometry — only a real change is a choice.
    if (JSON.stringify(parsed) !== JSON.stringify(SHADOW_GEOMETRY_DEFAULTS)) {
      style.shadowGeometry = parsed
    }
  } else if (finals.hard.light !== undefined || finals.soft.light !== undefined) {
    style.shadow = 'soft'
  }

  if (opacity.light !== undefined) {
    style.shadowOpacity = Number.parseFloat(opacity.light)
  }

  if (shadowColor.light !== undefined || shadowColor.dark !== undefined) {
    // The export force-emits neutral-950/black when no color was chosen.
    const forced = shadowColor.light === 'var(--ui-color-neutral-950)' && shadowColor.dark === 'black'
    if (!forced) {
      const named = (Object.keys(SHADOW_COLOR_VALUES) as Array<keyof typeof SHADOW_COLOR_VALUES>)
        .find(key => SHADOW_COLOR_VALUES[key].light === shadowColor.light && SHADOW_COLOR_VALUES[key].dark === shadowColor.dark)
      const lightRef = parseUiColorRef(shadowColor.light)
      const darkRef = parseUiColorRef(shadowColor.dark)
      if (named) {
        style.shadowColor = named
      } else if (lightRef && darkRef && lightRef.alias === darkRef.alias && (lightRef.alias === 'neutral' || lightRef.alias === 'primary')) {
        style.shadowColor = lightRef.alias === 'primary' ? 'primary-shade' : 'shade'
        style.shadowShade = { light: lightRef.shade, dark: darkRef.shade }
      }
    }
  }

  if (frameColor.light !== undefined || frameColor.dark !== undefined) {
    const named = (Object.keys(FRAME_COLOR_VALUES) as Array<keyof typeof FRAME_COLOR_VALUES>)
      .find(key => FRAME_COLOR_VALUES[key].light === frameColor.light && FRAME_COLOR_VALUES[key].dark === frameColor.dark)
    const lightRef = parseUiColorRef(frameColor.light)
    const darkRef = parseUiColorRef(frameColor.dark)
    if (named) {
      style.borderColor = named
    } else if (lightRef && darkRef && lightRef.alias === darkRef.alias && (lightRef.alias === 'neutral' || lightRef.alias === 'primary')) {
      style.borderColor = lightRef.alias === 'primary' ? 'primary-shade' : 'shade'
      style.borderShade = { light: lightRef.shade, dark: darkRef.shade }
    }
  }

  return style
}

/* ------------------------------------------------------------- config -- */

/**
 * Parser for the restricted object-literal grammar generateConfig emits
 * (unquoted keys, single-quoted strings, numbers, booleans, arrays) — a
 * tokenizer, not eval, so pasted content can't execute anything.
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
        obj[key] = parseValue()
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
      if (source[i] === '\\') i++
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
  const defaults: { size?: DefaultSize, variants?: Partial<Record<VariantGroup, DefaultVariant>> } = {}

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
  // choice — collapsing keeps re-exports byte-identical to the original.
  const groupValues = new Set(Object.values(defaults.variants || {}))
  if (groupValues.size === 1) {
    const [value] = [...groupValues] as [DefaultVariant]
    const expressible = Object.entries(VARIANT_GROUPS)
      .filter(([, groupComponents]) => groupComponents.some(component => VARIANT_SUPPORT[component]?.includes(value)))
      .map(([group]) => group as VariantGroup)
    if (expressible.every(group => defaults.variants?.[group] === value)) {
      return { variant: value, ...(defaults.size ? { size: defaults.size } : {}) }
    }
  }

  return Object.keys(defaults).length ? defaults : undefined
}

/** Border treatment lives only in the class bundles — read it back from them. */
function detectBorder(components: Record<string, any>): Pick<StyleOptions, 'border' | 'borderWidth'> {
  const classOf = (entry: Record<string, unknown>) => typeof entry.class === 'string' ? entry.class : Object.values(entry.class || {}).join(' ')
  const texts = Object.values(components).flatMap(component => [
    ...Object.values((component?.slots || {}) as Record<string, string>),
    ...((component?.compoundVariants || []) as Array<Record<string, unknown>>).map(classOf)
  ])

  const widths = texts.flatMap(text => [...text.matchAll(/(?:^|\s)(?:sm:)?ring-(\d)(?:\s|$)/g)].map(match => Number(match[1])))
  if (!widths.length) return {}
  const width = widths[0]!
  if (width === 0) return { border: 'none' }
  return { border: 'custom', ...(width !== BORDER_WIDTH_DEFAULT ? { borderWidth: width } : {}) }
}

/** Shadow fallback when only a config was pasted (CSS normally decides). */
function detectShadow(components: Record<string, any>): StyleOptions['shadow'] {
  const slots = Object.values(components).flatMap(component => Object.values(component?.slots || {})) as string[]
  if (slots.some(classes => classes.includes('var(--ui-shadow-offset-x)'))) return 'hard'
  if (slots.some(classes => classes.includes('--ui-shadow-final-soft'))) return 'soft'
  return undefined
}

/**
 * Remove the fragments the reconstructed style regenerates, leaving only
 * genuinely explicit component overrides for doc.components.
 */
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

  // Style: color/geometry variables come from the CSS, structure from the
  // config classes; either half alone still reconstructs what it can.
  const style: StyleOptions = css ? extractStyle(css.light, css.dark) : {}
  style.shadow ||= detectShadow(components)
  const border = detectBorder(components)
  if (border.border) {
    style.border = border.border
    if (border.borderWidth !== undefined) style.borderWidth = border.borderWidth
  }
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
    if (css.font) doc.font = { sans: css.font }
    if (css.spacing !== undefined) doc.spacing = css.spacing
    if (css.fontSize !== undefined) doc.fontSize = css.fontSize
    if (css.radius !== undefined) doc.radius = css.radius
    if (css.blackAsPrimary) {
      doc.blackAsPrimary = true
      // its .dark counterpart is generated, not a token choice
      if (css.dark['--ui-primary'] === 'white') delete css.dark['--ui-primary']
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
