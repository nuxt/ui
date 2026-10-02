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
