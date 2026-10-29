import { kebabCase } from 'scule'
import { createEngine } from 'cn/engine'
import tables from 'cn/tables'

export interface ComponentThemeSources {
  /** Every `data-slot` value the components render. */
  dataSlots: Set<string>
  /** The slot each namespace puts its bare name on, `root` or `base`. */
  outermost: Record<string, string>
  /** The `--ui-*` variables behind each Tailwind token, `@utility` keys prefixed with `@`. */
  tokens: Record<string, string[]>
}

type ClassValue = string | ClassValue[] | undefined | null | false

// Utility prefix to the token namespaces Tailwind looks its value up in, longest first.
const NAMESPACES: [string, string[]][] = [
  ['ring-offset', ['ring-offset-color', 'color']],
  ['inset-ring', ['ring-color', 'color']],
  ['inset-shadow', ['color']],
  ['divide', ['divide-color', 'color']],
  ['outline', ['outline-color', 'color']],
  ['stroke', ['stroke', 'color']],
  ['fill', ['fill', 'color']],
  ['ring', ['ring-color', 'color']],
  ['text', ['text-color', 'color']],
  ['bg', ['background-color', 'color']],
  ...['border-x', 'border-y', 'border-s', 'border-e', 'border-t', 'border-r', 'border-b', 'border-l', 'border'].map(prefix => [prefix, ['border-color', 'color']] as [string, string[]]),
  ...['rounded-ss', 'rounded-se', 'rounded-es', 'rounded-ee', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl', 'rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded'].map(prefix => [prefix, ['radius']] as [string, string[]]),
  ...['from', 'via', 'to', 'shadow', 'caret', 'decoration', 'accent', 'placeholder'].map(prefix => [prefix, ['color']] as [string, string[]]),
  ['font', ['font']]
]

// The merger `tv()` resolves slot classes with, so a theme extending another
// (SelectMenu on Select) reads as the classes that end up on the element
const { mergeString } = createEngine(tables)

// Tailwind's CSS functions, written like a variable inside an arbitrary value
const FUNCTIONS = new Set(['--spacing', '--alpha', '--theme'])

function toClasses(value: ClassValue): string[] {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value.flatMap(toClasses) : value.split(/\s+/).filter(Boolean)
}

function toClassString(value: ClassValue): string {
  return toClasses(value).join(' ')
}

/** The utility of a class, without its variants, `!` and opacity modifier. */
function utilityOf(className: string): string {
  let depth = 0
  let start = 0
  for (let index = 0; index < className.length; index++) {
    const char = className[index]
    if (char === '[' || char === '(') {
      depth++
    } else if (char === ']' || char === ')') {
      depth--
    } else if (char === ':' && depth === 0) {
      start = index + 1
    }
  }
  return className.slice(start).replace(/^!|!$/g, '').replace(/\/[\w.]+$/, '')
}

function collectVariables(classes: string[], tokens: ComponentThemeSources['tokens'], reads: Set<string>, sets: Set<string>) {
  for (const className of classes) {
    const utility = utilityOf(className)

    // `[--ui-control-px:--spacing(2)]` sets a variable, any other `--name` in the class reads one
    const declared = utility.match(/^\[(--[\w-]+):/)?.[1]
    if (declared) {
      sets.add(declared)
    }
    for (const match of className.matchAll(/--[a-z][\w-]*/g)) {
      if (match[0] !== declared && !FUNCTIONS.has(match[0])) {
        reads.add(match[0])
      }
    }

    for (const name of tokens[`@${utility}`] ?? []) {
      reads.add(name)
    }
    const namespace = NAMESPACES.find(([prefix]) => utility.startsWith(`${prefix}-`))
    if (namespace) {
      const value = utility.slice(namespace[0].length + 1)
      const token = namespace[1].map(name => tokens[`${name}-${value}`]).find(Boolean)
      for (const name of token ?? []) {
        reads.add(name)
      }
    }
  }
}

function flatten(value: unknown): Record<string, any>[] {
  return Array.isArray(value) ? value.flatMap(flatten) : value ? [value as Record<string, any>] : []
}

function toVariantValue(key: string): string | boolean {
  return key === 'true' ? true : key === 'false' ? false : key
}

/**
 * Describes a component theme for an agent extending it: its slots with their
 * `data-slot`, its variants, `defaultVariants`, `compoundVariants` and the CSS
 * variables its classes read and set. Variant classes are left out unless
 * `full` is set, the slot classes and compound variants are always there.
 */
export function describeComponentTheme(camelName: string, theme: Record<string, any>, sources: ComponentThemeSources, { full = false }: { full?: boolean } = {}) {
  const namespace = kebabCase(camelName)
  const reads = new Set<string>()
  const sets = new Set<string>()

  const slots = Object.fromEntries(Object.entries<ClassValue>(theme.slots ?? {}).map(([slot, value]) => {
    const classes = toClasses(mergeString(toClassString(value)))
    collectVariables(classes, sources.tokens, reads, sets)

    const dataSlot = sources.outermost[namespace] === slot && sources.dataSlots.has(namespace)
      ? namespace
      : sources.dataSlots.has(`${namespace}-${slot}`) ? `${namespace}-${slot}` : undefined

    return [slot, { ...(dataSlot ? { dataSlot } : {}), class: classes.join(' ') }]
  }))

  // Variant and compound classes are always given per slot, `{ base: '...' }`,
  // anything else targets no slot (`src/runtime/utils/tv.ts`)
  const perSlot = (value: unknown) => {
    const classes: Record<string, string> = value && typeof value === 'object' && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value as Record<string, ClassValue>).map(([slot, slotClasses]) => [slot, toClassString(slotClasses)]).filter(([, slotClasses]) => slotClasses))
      : {}
    Object.values(classes).forEach(slotClasses => collectVariables(toClasses(slotClasses), sources.tokens, reads, sets))
    return classes
  }

  const variants = Object.fromEntries(Object.entries<Record<string, unknown>>(theme.variants ?? {}).map(([variant, values]) => {
    const classes = Object.entries(values).map(([key, value]) => [key, perSlot(value)] as const)
    return [variant, full ? Object.fromEntries(classes) : classes.map(([key]) => toVariantValue(key))]
  }))

  const compoundVariants = flatten(theme.compoundVariants).map(({ class: classes, ...conditions }: Record<string, any>) => ({ ...conditions, class: perSlot(classes) }))

  return {
    slots,
    variants,
    defaultVariants: theme.defaultVariants ?? {},
    compoundVariants,
    cssVariables: {
      reads: [...reads].sort(),
      sets: [...sets].sort()
    }
  }
}
