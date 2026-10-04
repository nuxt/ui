import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { describe, it, expect } from 'vitest'

const componentsDir = join(process.cwd(), 'src/runtime/components')

const themes = import.meta.glob<Record<string, any>>('../../src/runtime/theme/**/*.ts', { eager: true, import: 'default' })

/**
 * Variants a component sets itself, with no prop to hold their default, which
 * stays in the theme's `defaultVariants`.
 */
const internal: Record<string, string[]> = {
  'Calendar.vue': ['view'],
  'Editor.vue': ['placeholderMode'],
  'Select.vue': ['position'],
  'SelectMenu.vue': ['position']
}

/**
 * A component that renders itself for its nested items, from the same theme
 * and the same `<UTheme :props>` key, so it takes the resolved value.
 */
const forwardedToItself: Record<string, string[]> = {
  'content/ContentNavigation.vue': ['UContentNavigation']
}

/**
 * Props a component picks for the Reka UI primitive it wraps, which has no
 * theme of its own.
 */
const pickedForPrimitive: Record<string, string[]> = {
  'CheckboxGroup.vue': ['orientation'],
  'Drawer.vue': ['direction'],
  'Separator.vue': ['orientation'],
  'Slider.vue': ['orientation']
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(join(dir, entry.name))
    : entry.name.endsWith('.vue') ? [join(dir, entry.name)] : [])
}

const components = walk(componentsDir).flatMap((file) => {
  const source = readFileSync(file, 'utf8')
  const themeImport = source.match(/import theme from '((?:\.\.\/)+theme\/[^']+)'/)
  if (!themeImport) {
    return []
  }
  const themeKey = Object.keys(themes).find(key => join(process.cwd(), 'test/utils', key) === join(dirname(file), `${themeImport[1]}.ts`))
  return themeKey ? [[relative(componentsDir, file), source, themes[themeKey]!] as const] : []
})

function defaults(source: string): Record<string, string> {
  const block = source.match(/withDefaults\(defineProps<[^\n]*>\(\), \{\n([\s\S]*?)\n\}\)/)
  return Object.fromEntries((block?.[1]?.split('\n') ?? []).flatMap((line) => {
    const entry = line.match(/^\s*(\w+): (.+?)(?: as never)?,?$/)
    return entry ? [[entry[1]!, entry[2]!]] : []
  }))
}

/**
 * The default of a prop lives in the component's `withDefaults`, the theme
 * variants included, the one place `useComponentProps`, `tv()` and the
 * template's data attributes all read. A theme only defaults a variant the
 * component sets itself.
 */
describe('variant defaults', () => {
  it('finds the components', () => {
    expect(components.length).toBeGreaterThan(100)
  })

  it.each(components)('%s defaults its variant props in withDefaults', (name, _, theme) => {
    const keys = Object.keys(theme.defaultVariants ?? {}).filter(key => !internal[name]?.includes(key))
    expect(keys, 'move these from the theme\'s `defaultVariants` to the component\'s `withDefaults`').toEqual([])
  })

  // A prop now always holds a value, its `withDefaults` one when the parent
  // passed none, so passing `props.size` to a child would hand it that default
  // as an explicit prop, over the child's own default and its `<UTheme :props>`
  // key. What a component passes down comes from `useGivenProps`.
  it.each(components)('%s passes what it was given to its children', (name, source, theme) => {
    const keys = Object.keys(defaults(source)).filter(key => Object.keys(theme.variants?.[key] ?? {}).some(value => value !== 'true' && value !== 'false'))
    const template = source.slice(source.indexOf('<template>'))
    const script = source.slice(0, source.indexOf('<template>'))
    const problems: string[] = []
    for (const key of keys) {
      const kebab = key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
      for (const match of template.matchAll(new RegExp(`<(U[A-Z]\\w*)\\b[^>]*?\\s:(?:${key}|${kebab})="props\\.${key}"`, 'g'))) {
        if (!forwardedToItself[name]?.includes(match[1]!)) {
          problems.push(`\`${match[1]}\` gets \`props.${key}\``)
        }
      }
      // A computed over the prop, like `size` for `formFieldSize.value ?? props.size`
      if (new RegExp(`const ${key} = computed\\(\\(\\) => [^\\n]*props\\.${key}\\b`).test(script)) {
        for (const match of template.matchAll(new RegExp(`<(U[A-Z]\\w*)\\b[^>]*?\\s:(?:${key}|${kebab})="${key}"`, 'g'))) {
          problems.push(`\`${match[1]}\` gets the resolved \`${key}\``)
        }
      }
      for (const match of script.matchAll(/reactivePick\(props, ([^)]*)\)/g)) {
        if (match[1]!.includes(`'${key}'`) && !pickedForPrimitive[name]?.includes(key)) {
          problems.push(`\`reactivePick(props, ...)\` forwards \`${key}\``)
        }
      }
    }
    expect(problems, 'read it from `useGivenProps(name, _props)`').toEqual([])
  })

  it.each(components)('%s documents its variant defaults', (_, source, theme) => {
    const problems: string[] = []
    for (const [prop, value] of Object.entries(defaults(source))) {
      const documented = source.match(new RegExp(`@defaultValue ([^\\n]+)\\n(?:\\s*\\*[^\\n]*\\n)*?\\s*\\*/\\n\\s*${prop}\\?:`))
      if (documented && value.slice(1, -1) in (theme.variants?.[prop] ?? {}) && documented[1]!.trim() !== value) {
        problems.push(`\`${prop}\` is documented as ${documented[1]!.trim()}, \`withDefaults\` sets ${value}`)
      }
    }
    expect(problems).toEqual([])
  })
})
