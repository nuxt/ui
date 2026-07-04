import colors from 'tailwindcss/colors'
import { cssVariableDefaults } from '../theme'
import type { ColorAlias, Shade, ThemeDoc } from './types'
import { DEFAULT_COLORS } from './types'

export type ColorMode = 'light' | 'dark'

export interface ResolvedToken {
  token: string
  /** The declared value at this level (`var(--ui-color-neutral-200)`, `white`, `#fff`…) */
  raw: string
  /** The final computed color when the chain resolves to one, otherwise the last known reference */
  value: string
  source: 'default' | 'override'
  /**
   * Inheritance breadcrumb, outermost first, e.g.
   * `['--ui-border', '--ui-color-neutral-200', '--color-slate-200', '#e2e8f0']`
   */
  chain: string[]
}

const UI_COLOR_RE = /^var\(--ui-color-([a-z]+)-(\d{2,3})\)$/

export function resolveAlias(doc: ThemeDoc, alias: ColorAlias): string {
  return doc.colors?.[alias] || DEFAULT_COLORS[alias]
}

/** Hex for a palette shade: custom palette first, then its base, then tailwind. */
export function resolveShade(doc: ThemeDoc, palette: string, shade: Shade): string | undefined {
  const custom = doc.palettes?.[palette]
  if (custom) {
    const hex = custom.shades[shade]
    if (hex) return hex
    if (custom.extends) return resolveShade(doc, custom.extends, shade)
    return undefined
  }
  const tailwind = (colors as Record<string, unknown>)[palette]
  if (tailwind && typeof tailwind === 'object') {
    return (tailwind as Record<string, string>)[shade]
  }
  return undefined
}

export function resolveToken(doc: ThemeDoc, mode: ColorMode, token: string): ResolvedToken {
  const defaults = cssVariableDefaults[mode] as Record<string, string>
  const override = doc.tokens?.[mode]?.[token]
  const raw = override ?? defaults[token] ?? ''

  const chain = [token]
  let value = raw

  const match = raw.match(UI_COLOR_RE)
  if (match) {
    const [, alias, shade] = match
    chain.push(`--ui-color-${alias}-${shade}`)

    const palette = resolveAlias(doc, alias as ColorAlias)
    chain.push(`--color-${palette}-${shade}`)

    const hex = resolveShade(doc, palette, Number(shade) as Shade)
    if (hex) {
      chain.push(hex)
      value = hex
    }
  } else if (raw) {
    chain.push(raw)
  }

  return {
    token,
    raw,
    value,
    source: override !== undefined ? 'override' : 'default',
    chain
  }
}

/** Resolve every semantic token for a mode, with provenance. */
export function resolveTokens(doc: ThemeDoc, mode: ColorMode): Record<string, ResolvedToken> {
  const defaults = cssVariableDefaults[mode] as Record<string, string>
  const tokens = new Set([...Object.keys(defaults), ...Object.keys(doc.tokens?.[mode] || {})])

  return Object.fromEntries([...tokens].map(token => [token, resolveToken(doc, mode, token)]))
}
