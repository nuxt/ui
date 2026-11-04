/**
 * The variables of the theme that aren't shades of a ramp: the control
 * scale, the page sizes, the focus and disabled states and the chart
 * series. One builder writes them for the live style tag,
 * the FOUC script and the export, so the three can't drift.
 */
import colors from 'tailwindcss/colors'

/* --------------------------------------------------------------- layout -- */

export const CONTROL_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type ControlSize = typeof CONTROL_SIZES[number]

/**
 * Each column of the control scale, with its values in px as @nuxt/ui ships
 * them (src/runtime/css/base.css). `density` marks the columns a density
 * moves: the padding and the gap, the room around the icon, box and text.
 */
export const CONTROL_COLUMNS = [
  { key: 'px', label: 'X', values: [8, 10, 10, 12, 12], density: true },
  { key: 'py', label: 'Y', values: [4, 6, 6, 8, 8], density: true },
  { key: 'gap', label: 'Gap', values: [4, 6, 6, 8, 8], density: true },
  { key: 'icon-size', label: 'Icon', values: [16, 16, 20, 20, 24], density: false },
  { key: 'box', label: 'Box', values: [12, 14, 16, 18, 20], density: false },
  { key: 'text', label: 'Text', values: [12, 12, 14, 14, 16], density: false },
  { key: 'text--line-height', label: 'Line', values: [16, 16, 20, 20, 24], density: false }
] as const

export type ControlColumn = typeof CONTROL_COLUMNS[number]['key']

/** `--ui-control-text-md--line-height` keeps the size before the suffix. */
export function controlVariable(column: ControlColumn, size: ControlSize): string {
  return column === 'text--line-height' ? `--ui-control-text-${size}--line-height` : `--ui-control-${column}-${size}`
}

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
  /** Cells of the control scale, by variable, in px, only where they differ from the density. */
  scale?: Record<string, number>
  tint?: Exclude<Tint, 'default'>
}

/* ----------------------------------------------------------------- tint -- */

export type Tint = 'subtle' | 'default' | 'vivid'

export const TINTS: Tint[] = ['subtle', 'default', 'vivid']

/** The colors a tint reaches, neutral's fills are surfaces of their own. */
export const TINT_COLORS = ['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const

/**
 * The opacity of each color's fills and borders per tint, the recipes of
 * src/runtime/css/tokens.css at `default`. `bg-strong` is the hover of
 * `bg-soft`, so it stays above it at every step.
 */
export const TINT_LEVELS: Record<Exclude<Tint, 'default'>, Record<string, number>> = {
  subtle: { 'bg-tint': 3, 'bg-soft': 6, 'bg-strong': 10, 'border-default': 15, 'border-strong': 35 },
  vivid: { 'bg-tint': 10, 'bg-soft': 20, 'bg-strong': 30, 'border-default': 40, 'border-strong': 70 }
}

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
  scale: Object.fromEntries(CONTROL_COLUMNS.flatMap(column => CONTROL_SIZES.map((size, index) => [controlVariable(column.key, size), {
    default: column.values[index]!,
    // menu labels read the text less 2px, 10px keeps them legible
    min: column.key === 'text' ? 10 : 0,
    max: column.key === 'text' ? 32 : 64,
    density: column.density,
    unit: column.key === 'text' ? 'rem' : 'spacing'
  }]))),
  density: DENSITY_STEPS,
  tint: { colors: TINT_COLORS, levels: TINT_LEVELS },
  fields: LAYOUT_FIELDS,
  gutterBase: GUTTER_BASE,
  charts: { defaults: CHART_DEFAULTS, colors: CHART_COLORS },
  // Tailwind's `sm`, the docs keep the default breakpoints
  smMedia: '(width >= 40rem)'
}

export type ExtrasTables = typeof EXTRAS_TABLES

/**
 * The variables the studio writes from its own fields. A token override of one
 * would sit in a later style tag and shadow the slider, so the token channel
 * never takes them (sanitizeCSSVariables).
 */
export const EXTRAS_VARIABLES = new Set([
  ...Object.keys(EXTRAS_TABLES.scale),
  ...Object.values(LAYOUT_FIELDS).map(field => field.variable),
  ...CHART_SERIES.map(series => `--ui-chart-${series}`),
  ...TINT_COLORS.flatMap(color => Object.keys(TINT_LEVELS.vivid).map(role => `--ui-${color}-${role}`))
])

export interface ExtrasInput {
  layout?: unknown
  charts?: unknown
}

export interface ThemeExtras {
  /** The input with every value checked and every default dropped. */
  layout?: ThemeLayout
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
  if (rawLayout.tint === 'subtle' || rawLayout.tint === 'vivid') {
    layout.tint = rawLayout.tint
    for (const color of tables.tint.colors) {
      for (const [role, value] of Object.entries(tables.tint.levels[layout.tint])) {
        root[`--ui-${color}-${role}`] = `color-mix(in oklab, var(--ui-${color}) ${value}%, transparent)`
      }
    }
  }
  const step = layout.density ? tables.density[layout.density] : 0
  const rawScale = record(rawLayout.scale)
  const scale: Record<string, number> = {}
  for (const [variable, cell] of Object.entries(tables.scale)) {
    const base = cell.default + (cell.density ? step : 0)
    const own = number(rawScale[variable], cell.min, cell.max)
    if (own !== undefined && (own !== base || own !== cell.default)) scale[variable] = own
    const value = own ?? base
    if (value !== cell.default) root[variable] = write(value, cell.unit)
  }
  if (Object.keys(scale).length) layout.scale = scale
  for (const [key, field] of Object.entries(tables.fields)) {
    const value = number(rawLayout[key], field.min, field.max)
    if (value === undefined || value === field.default) continue
    layout[key as LayoutField] = value
    if (key === 'gutter' && value >= tables.gutterBase) sm[field.variable] = write(value, field.unit)
    else root[field.variable] = write(value, field.unit)
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
export function normalizeExtras(input: ExtrasInput): { layout?: ThemeLayout, charts?: ThemeCharts } {
  const { layout, charts } = themeExtras(input)
  return { ...(layout ? { layout } : {}), ...(charts ? { charts } : {}) }
}

/** The value a scale cell rests on for a density, before any override. */
export function controlBase(variable: string, density: Density = 'default'): number {
  const cell = EXTRAS_TABLES.scale[variable]!
  return cell.default + (cell.density ? DENSITY_STEPS[density] : 0)
}
