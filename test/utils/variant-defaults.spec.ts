import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { describe, it, expect } from 'vitest'

const componentsDir = join(process.cwd(), 'src/runtime/components')

const themes = import.meta.glob<Record<string, any>>('../../src/runtime/theme/**/*.ts', { eager: true, import: 'default' })

/**
 * A default the component keeps in `withDefaults` although the prop is a theme
 * variant, with the reason.
 */
const exceptions: Record<string, string> = {
  // The component passes no `contentOrientation` to the theme when vertical,
  // which a theme default would fill back in
  'NavigationMenu.vue:contentOrientation': 'depends on `orientation`',
  // Props another type declares, whose default the docs read from
  // `withDefaults`. `DrawerRootProps` owns `direction`, `layout` is declared
  // per member of a union
  'Drawer.vue:direction': 'declared by `DrawerRootProps`',
  'EditorToolbar.vue:layout': 'declared per member of a union'
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

/**
 * A prop that is a theme variant takes its default from the theme's
 * `defaultVariants`, the one place `useComponentProps`, `tv()` and the
 * template's data attributes all read. Booleans and props the theme doesn't
 * style stay in `withDefaults`.
 */
describe('variant defaults', () => {
  it('finds the components', () => {
    expect(components.length).toBeGreaterThan(100)
  })

  it.each(components)('%s keeps no variant default in withDefaults', (name, source, theme) => {
    const block = source.match(/withDefaults\(defineProps<[^\n]*>\(\), \{\n([\s\S]*?)\n\}\)/)
    const problems: string[] = []
    for (const line of block?.[1]?.split('\n') ?? []) {
      const entry = line.match(/^\s*(\w+): '([^']*)'/)
      if (!entry) {
        continue
      }
      const [, prop, value] = entry
      if (value! in (theme.variants?.[prop!] ?? {}) && !exceptions[`${name}:${prop}`]) {
        problems.push(`\`${prop}: '${value}'\` belongs in the theme's \`defaultVariants\``)
      }
    }
    expect(problems).toEqual([])
  })

  it.each(components)('%s documents the theme\'s defaults', (_, source, theme) => {
    const problems: string[] = []
    for (const [prop, value] of Object.entries(theme.defaultVariants ?? {})) {
      const documented = source.match(new RegExp(`@defaultValue ([^\\n]+)\\n(?:\\s*\\*[^\\n]*\\n)*?\\s*\\*/\\n\\s*${prop}\\?:`))
      if (documented && documented[1]!.trim().replace(/^'|'$/g, '') !== String(value)) {
        problems.push(`\`${prop}\` is documented as ${documented[1]!.trim()}, the theme defaults to '${value}'`)
      }
    }
    expect(problems).toEqual([])
  })
})
