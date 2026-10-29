import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'pathe'
import { defineNuxtModule, createResolver } from '@nuxt/kit'

/**
 * Reads what the `get-component-theme` MCP tool can't take from the theme
 * objects themselves, and inlines it in `#component-theme/nitro` since the
 * sources aren't deployed with the server:
 * - the `data-slot` values the components render, and which slot is the
 *   outermost element of each one, read the way `nuxt-ui/data-slot-namespace`
 *   in `eslint.config.mjs` writes them;
 * - the `--ui-*` variables behind each Tailwind token and utility of
 *   `src/runtime/css`, so `bg-accent-soft` resolves to `--ui-accent-bg-soft`.
 */
export default defineNuxtModule({
  meta: {
    name: 'component-theme'
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('../../src/runtime')

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {}
      nitroConfig.virtual['#component-theme/nitro'] = () => {
        const { dataSlots, outermost } = readDataSlots(join(runtimeDir, 'components'))
        const tokens = readTokens([join(runtimeDir, 'css/tokens.css'), join(runtimeDir, 'css/tailwind.css')])

        return `export const dataSlots = new Set(${JSON.stringify([...dataSlots].sort())})
export const outermost = ${JSON.stringify(outermost)}
export const tokens = ${JSON.stringify(tokens)}
`
      }
    })
  }
})

function readDataSlots(dir: string) {
  const dataSlots = new Set<string>()
  // The slot each namespace puts its bare name on, `root` or `base`
  const outermost: Record<string, string> = {}

  // Prose components emit no `data-slot`
  for (const file of [...readdirSync(dir), ...readdirSync(join(dir, 'content')).map(file => `content/${file}`)]) {
    if (!file.endsWith('.vue')) {
      continue
    }

    const source = readFileSync(join(dir, file), 'utf-8')
    const template = source.slice(source.indexOf('<template'))

    for (const match of template.matchAll(/\sdata-slot="([\w-]+)"/g)) {
      dataSlots.add(match[1]!)
    }
    // `:data-slot="($attrs['data-slot'] as string | undefined) ?? 'button'"`
    for (const match of template.matchAll(/:data-slot="([^"]*)"/g)) {
      for (const value of match[1]!.matchAll(/'([\w-]+)'/g)) {
        if (value[1] !== 'data-slot') {
          dataSlots.add(value[1]!)
        }
      }
    }

    const namespace = source.match(/import theme from '(?:\.\.\/)+theme\/([\w/-]+)'/)?.[1]?.replace(/^content\//, '').replaceAll('/', '-')
    if (!namespace) {
      continue
    }
    // The whole file, not only the template: Avatar and Link resolve their
    // outermost class in a `computed`, `ui.value({ ... }).base({ class: props.class })`
    if (/\bui(?:\.value)?(?:\([^)]*\))?\.root\(/.test(source)) {
      outermost[namespace] = 'root'
    } else if (/\bui(?:\.value)?(?:\([^)]*\))?\.base\(\{[^}]*\bprops\.class\b/.test(source)) {
      outermost[namespace] = 'base'
    }
  }

  return { dataSlots, outermost }
}

/**
 * Maps each `@theme` token (`background-color-accent-soft`) and `@utility`
 * (`bg-overlay`) to the `--ui-*` variables it reads. `--ui-layer-*` is left
 * out: only `bg-overlay` sets it, to point the neutral tokens at the overlay
 * ones.
 */
function readTokens(files: string[]) {
  const tokens: Record<string, string[]> = {}
  const variables = (value: string) => [...new Set([...value.matchAll(/var\((--ui-[\w-]+)/g)].map(match => match[1]!))].filter(name => !name.startsWith('--ui-layer-'))

  for (const file of files) {
    const css = readFileSync(file, 'utf-8')

    for (const block of css.matchAll(/@theme[^{]*\{([^}]*)\}/g)) {
      for (const declaration of block[1]!.matchAll(/^\s*--([\w-]+):([^;]+);/gm)) {
        tokens[declaration[1]!] = variables(declaration[2]!)
      }
    }
    for (const block of css.matchAll(/@utility ([\w-]+)\s*\{([^}]*)\}/g)) {
      tokens[`@${block[1]}`] = variables(block[2]!)
    }
  }

  return tokens
}
