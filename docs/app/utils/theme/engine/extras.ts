/**
 * The variables of the theme that aren't shades of a ramp: the control
 * density, the page sizes, the focus and disabled states, the hover tint and
 * the chart series. One builder writes them for the live style tag,
 * the FOUC script and the export, so the three can't drift.
 */
import colors from 'tailwindcss/colors'

/* --------------------------------------------------------------- layout -- */

export const CONTROL_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type ControlSize = typeof CONTROL_SIZES[number]

/**
 * The padding and gap of the control scale in px, as @nuxt/ui ships them
 * (src/runtime/css/base.css): what a density moves. The icon, box and text of
 * each size stay, a density moves the room around them.
 */
export const CONTROL_SPACING = {
  px: [8, 10, 10, 12, 12],
  py: [4, 6, 6, 8, 8],
  gap: [4, 6, 6, 8, 8]
} as const

export type Density = 'compact' | 'default' | 'comfortable'

/** How far a density moves the padding and gap of every size, in px. */
export const DENSITY_STEPS: Record<Density, number> = {
  compact: -2,
  default: 0,
  comfortable: 2
}

export const DENSITIES = Object.keys(DENSITY_STEPS) as Density[]

/**
 * The single variables, in px or %, with the library's value and the travel
 * the studio gives each. `unit` is how the value is written: `spacing` as a
 * `--spacing` step, `rem` over a 16px root.
 */
export const LAYOUT_FIELDS = {
  textStep: { variable: '--ui-control-text-step', label: 'Field text', default: 0, min: 0, max: 4, step: 1, unit: 'rem' },
  gutter: { variable: '--ui-gutter', label: 'Gutter', default: 24, min: 8, max: 48, step: 4, unit: 'spacing' },
  headerHeight: { variable: '--ui-header-height', label: 'Header', default: 64, min: 48, max: 96, step: 4, unit: 'rem' },
  focusWidth: { variable: '--ui-focus-width', label: 'Focus', default: 3, min: 1, max: 6, step: 1, unit: 'px' },
  disabledOpacity: { variable: '--ui-disabled-opacity', label: 'Disabled', default: 75, min: 25, max: 100, step: 5, unit: '%' }
} as const

export type LayoutField = keyof typeof LAYOUT_FIELDS

/**
 * The gutter under `sm`, in px. The gutter slider sets it from `sm`, small
 * screens keep this one unless the slider goes below it.
 */
export const GUTTER_BASE = 16

/** Sparse like the rest of the doc: an absent field is the library's value. */
export interface ThemeLayout extends Partial<Record<LayoutField, number>> {
  density?: Exclude<Density, 'default'>
}

/* ---------------------------------------------------------------- mixes -- */

/** Which slice of the studio owns a role, mirrors `SectionKey`. */
type MixSection = 'surfaces' | 'states'

/**
 * Roles whose recipe is a color at some opacity, unset in the library so they
 * default to it (src/runtime/css/tokens.css). The studio writes the recipe
 * back at another opacity.
 */
export const MIX_TARGETS: Array<{ token: string, label: string, base: string, default: number, section: MixSection }> = [
  { token: '--ui-bg-tint', label: 'Hover', base: 'var(--ui-bg-soft)', default: 50, section: 'surfaces' },
  { token: '--ui-outline-focus', label: 'Focus color', base: 'var(--ui-primary)', default: 25, section: 'states' }
]

/** Role variable → opacity in %. */
export type ThemeMixes = Record<string, number>

/* --------------------------------------------------------------- charts -- */

export const CHART_SERIES = ['1', '2', '3', '4', '5', '6'] as const

export const CHART_DEFAULTS: Record<typeof CHART_SERIES[number], string> = {
  1: 'primary',
  2: 'blue',
  3: 'violet',
  4: 'amber',
  5: 'rose',
  6: 'cyan'
}

export const CHART_ALIASES = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
const NOT_A_CHART_PALETTE = ['inherit', 'current', 'transparent', 'black', 'white', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']

/**
 * What a series can take: an alias, the same in both modes, or a palette at
 * 500 in light and 400 in dark like the library's. A palette goes with its
 * value as the fallback, like base.css: Tailwind only emits the `--color-*`
 * variables something uses.
 */
export const CHART_COLORS: Record<string, { light: string, dark: string }> = {
  ...Object.fromEntries(CHART_ALIASES.map(alias => [alias, { light: `var(--ui-${alias})`, dark: `var(--ui-${alias})` }])),
  ...Object.fromEntries(Object.entries(colors)
    .filter(([name, ramp]) => !NOT_A_CHART_PALETTE.includes(name) && typeof ramp === 'object')
    .map(([name, ramp]) => [name, {
      light: `var(--color-${name}-500, ${(ramp as Record<string, string>)[500]})`,
      dark: `var(--color-${name}-400, ${(ramp as Record<string, string>)[400]})`
    }]))
}

/** Series number → alias or palette name. */
export type ThemeCharts = Partial<Record<typeof CHART_SERIES[number], string>>

/* -------------------------------------------------------------- builder -- */

/** Every table the builder reads, plain data so the FOUC script can inline it. */
export const EXTRAS_TABLES = {
  scale: Object.fromEntries(Object.entries(CONTROL_SPACING).flatMap(([key, values]) => CONTROL_SIZES.map((size, index) => [`--ui-control-${key}-${size}`, values[index]!]))),
  density: DENSITY_STEPS,
  fields: LAYOUT_FIELDS,
  gutterBase: GUTTER_BASE,
  mixes: Object.fromEntries(MIX_TARGETS.map(target => [target.token, { base: target.base, default: target.default }])),
  charts: { defaults: CHART_DEFAULTS, colors: CHART_COLORS },
  // Tailwind's `sm`, the docs keep the default breakpoints
  smMedia: '(width >= 40rem)'
}

export type ExtrasTables = typeof EXTRAS_TABLES

export interface ExtrasInput {
  layout?: unknown
  mixes?: unknown
  charts?: unknown
}

export interface ThemeExtras {
  /** The input with every value checked and every default dropped. */
  layout?: ThemeLayout
  mixes?: ThemeMixes
  charts?: ThemeCharts
  /** The variables to set on `:root`, from `sm`, and per mode. */
  root: Record<string, string>
  sm: Record<string, string>
  light: Record<string, string>
  dark: Record<string, string>
  /** All of it as style tag text, empty when nothing differs. */
  css: string
}

/**
 * Check the input and write its variables, only those that differ from the
 * library. `spacing` spells a length in px as a `--spacing` step:
 * `--spacing(n)` in an export Tailwind compiles, a `calc()` in a style tag.
 *
 * The FOUC script inlines this function's source, so it reads nothing from
 * outside its arguments, and its body holds no line comments: the script is
 * collapsed onto one line.
 */
export function buildExtras(input: ExtrasInput, tables: ExtrasTables, spacing: (px: number) => string): ThemeExtras {
  const record = (value: unknown): Record<string, unknown> => (value && typeof value === 'object' ? value as Record<string, unknown> : {})
  const number = (value: unknown, min: number, max: number) => {
    if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.round(Math.min(max, Math.max(min, parsed)) * 2) / 2 : undefined
  }
  const write = (value: number, unit: string) => (unit === 'spacing' ? spacing(value) : unit === 'rem' ? `${value / 16}rem` : unit === '%' ? `${value}%` : `${value}px`)

  const root: Record<string, string> = {}
  const sm: Record<string, string> = {}
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}

  const rawLayout = record(input.layout)
  const layout: ThemeLayout = {}
  if (rawLayout.density === 'compact' || rawLayout.density === 'comfortable') layout.density = rawLayout.density
  const step = layout.density ? tables.density[layout.density] : 0
  if (step) {
    for (const [variable, value] of Object.entries(tables.scale)) root[variable] = spacing(value + step)
  }
  for (const [key, field] of Object.entries(tables.fields)) {
    const value = number(rawLayout[key], field.min, field.max)
    if (value === undefined || value === field.default) continue
    layout[key as LayoutField] = value
    if (key === 'gutter' && value >= tables.gutterBase) sm[field.variable] = write(value, field.unit)
    else root[field.variable] = write(value, field.unit)
  }

  const rawMixes = record(input.mixes)
  const mixes: ThemeMixes = {}
  for (const [token, mix] of Object.entries(tables.mixes)) {
    const value = number(rawMixes[token], 0, 100)
    if (value === undefined || value === mix.default) continue
    mixes[token] = value
    root[token] = `color-mix(in oklab, ${mix.base} ${value}%, transparent)`
  }

  const rawCharts = record(input.charts)
  const charts: ThemeCharts = {}
  for (const [series, fallback] of Object.entries(tables.charts.defaults)) {
    const value = rawCharts[series]
    if (typeof value !== 'string' || value === fallback || !Object.prototype.hasOwnProperty.call(tables.charts.colors, value)) continue
    charts[series as keyof ThemeCharts] = value
    light[`--ui-chart-${series}`] = tables.charts.colors[value]!.light
    dark[`--ui-chart-${series}`] = tables.charts.colors[value]!.dark
  }

  const block = (selector: string, variables: Record<string, string>) => {
    const entries = Object.entries(variables)
    return entries.length ? `${selector} { ${entries.map(([key, value]) => `${key}: ${value};`).join(' ')} }` : ''
  }
  const smBlock = block(':root', sm)
  const css = [block(':root', root), smBlock && `@media ${tables.smMedia} { ${smBlock} }`, block(':root', light), block('.dark', dark)].filter(Boolean).join(' ')

  return {
    layout: Object.keys(layout).length ? layout : undefined,
    mixes: Object.keys(mixes).length ? mixes : undefined,
    charts: Object.keys(charts).length ? charts : undefined,
    root,
    sm,
    light,
    dark,
    css
  }
}

/** `--spacing(n)` outside Tailwind, for the live style tags. */
export const spacingCalc = (px: number) => `calc(var(--spacing) * ${px / 4})`

/** The extras of a doc, checked, with the live CSS. */
export function themeExtras(input: ExtrasInput): ThemeExtras {
  return buildExtras(input, EXTRAS_TABLES, spacingCalc)
}

/** Only the fields that differ from the library, the shape the state and the doc hold. */
export function normalizeExtras(input: ExtrasInput): { layout?: ThemeLayout, mixes?: ThemeMixes, charts?: ThemeCharts } {
  const { layout, mixes, charts } = themeExtras(input)
  return { ...(layout ? { layout } : {}), ...(mixes ? { mixes } : {}), ...(charts ? { charts } : {}) }
}
