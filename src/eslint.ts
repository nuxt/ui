import { readFileSync } from 'node:fs'
import { resolve } from 'pathe'
import type { Linter } from 'eslint'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'

type Severity = 'off' | 'warn' | 'error'

export interface NuxtUIESLintOptions {
  /**
   * The stylesheet that imports `tailwindcss` and `@nuxt/ui`, so the classes
   * it adds (semantic tokens, color aliases, your own `@theme`) are known.
   */
  entryPoint: string
  /**
   * The files to lint.
   * @defaultValue ['**\/*.vue', '**\/*.{js,mjs,ts,mts,jsx,tsx}']
   */
  files?: string[]
  /**
   * The palette each color alias points at, `{ error: 'red' }`. Read from the
   * `@plugin "@nuxt/ui/colors"` block of `entryPoint` when left out.
   */
  colors?: Record<string, string>
  /**
   * Classes `no-unknown-classes` leaves alone, as regular expressions.
   */
  ignore?: string[]
  rules?: {
    /**
     * Classes the stylesheet doesn't generate. Off by default: classes styled in
     * `<style>` blocks or your own CSS are unknown too, list them in `ignore`.
     * @defaultValue 'off'
     */
    'no-unknown-classes'?: Severity
    /** Raw palette colors (`text-gray-500`) and hardcoded colors (`bg-[#000]`). */
    'no-palette-colors'?: Severity
    /**
     * Physical classes on the inline axis (`ml-2`, `left-0`, `text-left`), for apps that support RTL.
     * @defaultValue 'off'
     */
    'enforce-logical-properties'?: Severity
  }
}

const DEFAULT_COLORS: Record<string, string> = {
  primary: 'sky',
  secondary: 'violet',
  success: 'emerald',
  info: 'blue',
  warning: 'amber',
  error: 'red',
  neutral: 'gray'
}

// Tailwind's palettes, except `neutral`: Nuxt UI's alias takes over `--color-neutral-*`
const GRAYS = ['slate', 'gray', 'zinc', 'stone', 'taupe', 'mauve', 'mist', 'olive']
const HUES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

const COLOR_UTILITY = '(?:bg|text|border(?:-[xytrblse]|-bs|-be)?|ring(?:-offset)?|outline|divide|fill|stroke|from|via|to|shadow|inset-shadow|inset-ring|decoration|accent|caret|placeholder)'
// A class with its variants, `md:hover:bg-red-500/50`
const CLASS = (utility: string, color: string) => `^(?:\\S*:)?!?-?(${utility})-(${color})(?:-\\d{2,3})?(?:\\/\\S+)?!?$`

type Shades = Record<number, string | string[]>

// The neutral shade each semantic token resolves to (`runtime/css/base.css`), in light mode and under `dark:`.
// A shade between two tokens suggests both, a shade no token is close to falls back to the full list.
const TEXT_SHADES: Record<'light' | 'dark', Shades> = {
  light: { 50: 'faint', 100: 'faint', 200: 'faint', 300: 'faint', 400: 'faint', 500: 'muted', 600: ['muted', 'default'], 700: 'default', 800: ['default', 'strong'], 900: 'strong', 950: 'strong' },
  dark: { 50: 'strong', 100: 'strong', 200: 'default', 300: ['default', 'muted'], 400: 'muted', 500: 'faint', 600: 'faint', 700: 'faint', 900: 'contrast', 950: 'contrast' }
}
const BG_SHADES: Record<'light' | 'dark', Shades> = {
  light: { 50: ['tint', 'soft'], 100: 'soft', 200: 'strong', 300: 'strong' },
  dark: { 600: 'strong', 700: 'strong', 800: 'soft', 900: 'default', 950: 'default' }
}
const BORDER_SHADES: Record<'light' | 'dark', Shades> = {
  light: { 50: 'default', 100: 'default', 200: 'default', 300: 'strong', 400: 'strong' },
  dark: { 600: 'strong', 700: 'strong', 800: 'default', 900: 'default', 950: 'default' }
}
const SHADE_TOKENS: [string, Record<'light' | 'dark', Shades>][] = [
  ['text', TEXT_SHADES],
  ['bg', BG_SHADES],
  ['border(?:-[xytrblse]|-bs|-be)?', BORDER_SHADES],
  ['divide', BORDER_SHADES],
  ['ring(?:-offset)?', BORDER_SHADES]
]

const GRAY_TOKENS: Record<string, string> = {
  text: '`text-default`, `text-muted`, `text-faint`, `text-strong` or `text-contrast`',
  bg: '`bg-default`, `bg-soft`, `bg-strong` or `bg-tint`',
  border: '`border-default` or `border-strong`',
  divide: '`divide-default` or `divide-strong`',
  ring: '`ring-default` or `ring-strong`'
}

/**
 * The palette each alias points at, from `@plugin "@nuxt/ui/colors" { primary: indigo; }`.
 * Only the entry is read, not the stylesheets it imports.
 */
function readColors(entryPoint: string): Record<string, string> {
  const css = readFileSync(entryPoint, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const block = css.match(/@plugin\s+["']@nuxt\/ui\/colors["']\s*\{([^}]*)\}/)?.[1]
  const colors = { ...DEFAULT_COLORS }
  for (const [, alias, palette] of block?.matchAll(/([\w-]+)\s*:\s*["']?([a-z]+)/g) ?? []) {
    colors[alias!] = palette!
  }
  return colors
}

function paletteRestrictions(colors: Record<string, string>) {
  const aliasOf = Object.fromEntries(Object.entries(colors).map(([alias, palette]) => [palette, alias]))
  const restrict: { pattern: string, message: string }[] = []

  const grays = GRAYS.join('|')
  // The token keeps the class's other variants and modifiers, `md:hover:text-gray-500/50` is `md:hover:text-muted/50`
  for (const [utility, modes] of SHADE_TOKENS) {
    for (const [shade, tokens] of Object.entries(modes.dark)) {
      restrict.push({
        pattern: `^((?:\\S*:)?)dark:((?:\\S*:)?)(!?)(${utility})-(?:${grays})-${shade}((?:\\/\\S+)?!?)$`,
        message: `"$0" uses a raw palette color. Use ${[tokens].flat().map(token => `\`$1$2$3$4-${token}$5\``).join(' or ')} in place of it and its light mode class, the token follows the color mode.`
      })
    }
    for (const [shade, tokens] of Object.entries(modes.light)) {
      restrict.push({
        pattern: `^(?!(?:\\S*:)?dark:)((?:\\S*:)?)(!?)(${utility})-(?:${grays})-${shade}((?:\\/\\S+)?!?)$`,
        message: `"$0" uses a raw palette color. Use ${[tokens].flat().map(token => `\`$1$2$3-${token}$4\``).join(' or ')} instead.`
      })
    }
  }
  for (const [utility, tokens] of Object.entries(GRAY_TOKENS)) {
    restrict.push({
      pattern: CLASS(utility === 'border' ? 'border(?:-[xytrblse]|-bs|-be)?' : utility, grays),
      message: `"$0" uses a raw palette color. Use a semantic token instead: ${tokens}.`
    })
  }
  restrict.push({
    pattern: CLASS(COLOR_UTILITY, grays),
    message: '"$0" uses a raw palette color. Use a semantic token or the `neutral` color instead.'
  })

  for (const hue of HUES) {
    const alias = aliasOf[hue]
    restrict.push({
      pattern: CLASS(COLOR_UTILITY, hue),
      message: alias
        ? `"$0" uses a raw palette color. \`${alias}\` points at \`${hue}\`, use \`$1-${alias}\` instead.`
        : `"$0" uses a raw palette color. Point a color alias at \`${hue}\` in \`@nuxt/ui/colors\` and use the alias instead.`
    })
  }

  restrict.push({
    pattern: `^(?:\\S*:)?!?-?(${COLOR_UTILITY})-\\[(?:color:)?(?:#|rgba?\\(|hsla?\\(|oklch\\(|oklab\\().*$`,
    message: '"$0" hardcodes a color. Use a semantic token or a color alias instead.'
  })
  return restrict
}

// Only the inline axis: Tailwind's rule also maps `mt-*`, `top-*`, `w-*` and `size-*` to their block and inline names
const BLOCK_AXIS = [
  '(?:^|:)!?-?(?:min-|max-)?[wh]-',
  '(?:^|:)!?-?size-',
  '(?:^|:)!?-?(?:scroll-)?[mp][tb]-',
  '(?:^|:)!?-?(?:top|bottom)-',
  '(?:^|:)!?(?:border|rounded)-[tb](?:-|$)',
  // `left-1/2 -translate-x-1/2` centers: as `inset-s-1/2` it drifts off center in RTL
  '(?:^|:)!?-?(?:left|right)-1/2$'
]

// The `ui` of `app.config.ts`, of `app.use(ui, { ui })` and of the Vite plugin. Only the paths that hold classes,
// minus the `*Size` slots which hold a size prop for a nested component.
const APP_CONFIG_MATCHERS = [
  { type: 'objectValues', path: '^ui\\.(?:prose\\.)?[\\w-]+\\.slots(?!.*Size$).*$' },
  { type: 'objectValues', path: '^ui\\.(?:prose\\.)?[\\w-]+\\.variants(?!.*Size$).*$' },
  { type: 'objectValues', path: '^ui\\.(?:prose\\.)?[\\w-]+\\.compoundVariants\\[\\d+\\]\\.class.*$' }
]

const SELECTORS = [
  ...getDefaultSelectors(),
  // `:ui` on any component, `:ui` on `<UTheme>`
  { kind: 'attribute', name: '^v-bind:ui$', match: [{ type: 'objectValues' }] },
  // `:variants` on `<UTheme>`, `{ button: { variant: { soft: { base } } } }`. The depth keeps
  // other `:variants` out, like motion's.
  { kind: 'attribute', name: '^v-bind:variants$', match: [{ type: 'objectValues', path: '^[\\w-]+\\.[\\w-]+\\.[\\w-]+\\.[\\w-]+$' }] },
  // `:props` on `<UTheme>`, `{ button: { ui: { base } } }`
  { kind: 'attribute', name: '^v-bind:props$', match: [{ type: 'objectValues', path: '^[\\w-]+\\.ui\\..*$' }] },
  { kind: 'callee', name: '^(?:defineAppConfig|use|ui)$', match: APP_CONFIG_MATCHERS }
]

/**
 * Lints the Tailwind CSS classes of an app that uses Nuxt UI, in templates,
 * `:ui` objects, `<UTheme>` and the `ui` of `app.config.ts`.
 *
 * ```ts
 * // eslint.config.mjs
 * import nuxtUI from '@nuxt/ui/eslint'
 *
 * export default [
 *   ...nuxtUI({ entryPoint: 'app/assets/css/main.css' })
 * ]
 * ```
 */
export default function nuxtUI(options: NuxtUIESLintOptions): Linter.Config[] {
  const entryPoint = resolve(options.entryPoint)
  const colors = options.colors ?? readColors(entryPoint)
  const rules = {
    'no-unknown-classes': 'off',
    'no-palette-colors': 'warn',
    'enforce-logical-properties': 'off',
    ...options.rules
  } satisfies NuxtUIESLintOptions['rules']

  return [{
    name: 'nuxt-ui/tailwindcss',
    files: options.files ?? ['**/*.vue', '**/*.{js,mjs,ts,mts,jsx,tsx}'],
    plugins: {
      'better-tailwindcss': betterTailwindcss as any
    },
    settings: {
      'better-tailwindcss': {
        entryPoint,
        selectors: SELECTORS
      }
    },
    rules: {
      'better-tailwindcss/no-unknown-classes': [rules['no-unknown-classes'], { ignore: options.ignore ?? [] }],
      'better-tailwindcss/no-restricted-classes': [rules['no-palette-colors'], { restrict: paletteRestrictions(colors) }],
      'better-tailwindcss/enforce-logical-properties': [rules['enforce-logical-properties'], { ignore: BLOCK_AXIS }]
    }
  }]
}
