import { resolve } from 'pathe'
import type { Linter } from 'eslint'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import type { NuxtUIESLintOptions } from './utils/eslint'

export type { NuxtUIESLintOptions }

const DEFAULT_COLORS: Record<string, string> = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  neutral: 'slate'
}

// Tailwind's palettes, except `neutral`: Nuxt UI's alias takes over `--color-neutral-*`
const GRAYS = ['slate', 'gray', 'zinc', 'stone', 'taupe', 'mauve', 'mist', 'olive']
const HUES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

const COLOR_UTILITY = '(?:bg|text|border(?:-[xytrblse]|-bs|-be)?|ring(?:-offset)?|outline|divide|fill|stroke|from|via|to|shadow|inset-shadow|inset-ring|decoration|accent|caret|placeholder)'
// A class with its variants, `md:hover:bg-red-500/50`
const CLASS = (utility: string, color: string) => `^(?:\\S*:)?!?-?(${utility})-(${color})(?:-\\d{2,3})?(?:\\/\\S+)?!?$`

type Shades = Record<number, string | string[]>

// The neutral shade each semantic token resolves to (`runtime/index.css`), in light mode and under `dark:`.
// A shade between two tokens suggests both, a shade no token is close to falls back to the full list.
const TEXT_SHADES: Record<'light' | 'dark', Shades> = {
  light: { 50: 'inverted', 100: 'inverted', 300: 'dimmed', 400: 'dimmed', 500: 'muted', 600: 'toned', 700: 'default', 800: ['default', 'highlighted'], 900: 'highlighted', 950: 'highlighted' },
  dark: { 50: 'highlighted', 100: 'highlighted', 200: 'default', 300: 'toned', 400: 'muted', 500: 'dimmed', 600: 'dimmed', 700: 'dimmed', 900: 'inverted', 950: 'inverted' }
}
const BG_SHADES: Record<'light' | 'dark', Shades> = {
  light: { 50: 'muted', 100: 'elevated', 200: 'accented', 300: 'accented', 900: 'inverted', 950: 'inverted' },
  dark: { 50: 'inverted', 100: 'inverted', 600: 'accented', 700: 'accented', 800: ['muted', 'elevated'], 900: 'default', 950: 'default' }
}
const BORDER_SHADES: Record<'light' | 'dark', Shades> = {
  light: { 50: 'default', 100: 'default', 200: 'default', 300: 'accented', 400: 'accented', 900: 'inverted', 950: 'inverted' },
  dark: { 50: 'inverted', 100: 'inverted', 600: 'accented', 700: ['muted', 'accented'], 800: 'default', 900: 'default', 950: 'default' }
}
const SHADE_TOKENS: [string, Record<'light' | 'dark', Shades>][] = [
  ['text', TEXT_SHADES],
  ['bg', BG_SHADES],
  ['border(?:-[xytrblse]|-bs|-be)?', BORDER_SHADES],
  ['divide', BORDER_SHADES],
  ['ring(?:-offset)?', BORDER_SHADES]
]

const GRAY_TOKENS: Record<string, string> = {
  text: '`text-default`, `text-muted`, `text-dimmed`, `text-toned`, `text-highlighted` or `text-inverted`',
  bg: '`bg-default`, `bg-muted`, `bg-elevated`, `bg-accented` or `bg-inverted`',
  border: '`border-default`, `border-muted`, `border-accented` or `border-inverted`',
  divide: '`divide-default`, `divide-muted`, `divide-accented` or `divide-inverted`',
  ring: '`ring-default`, `ring-muted`, `ring-accented` or `ring-inverted`'
}

function paletteRestrictions(colors: Record<string, string>) {
  // The first alias wins when two point at the same palette, `primary` before the others
  const aliasOf: Record<string, string> = {}
  for (const [alias, palette] of Object.entries(colors)) {
    aliasOf[palette] ??= alias
  }
  const restrict: { pattern: string, message: string }[] = []

  const grays = GRAYS.join('|')
  // The token keeps the class's other variants and modifiers, `md:hover:text-gray-500/50` is `md:hover:text-muted/50`
  for (const [utility, modes] of SHADE_TOKENS) {
    for (const [shade, tokens] of Object.entries(modes.dark)) {
      restrict.push({
        pattern: `^((?:\\S*:)?)dark:((?:\\S*:)?)(!?)(${utility})-(?:${grays})-${shade}((?:\\/\\S+)?!?)$`,
        message: `"$0" uses a raw palette color. In dark mode it's ${[tokens].flat().map(token => `\`$1$2$3$4-${token}$5\``).join(' or ')}. When its light mode class maps to the same token, use the token for both, it follows the color mode.`
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
      pattern: `^((?:\\S*:)?!?-?)(${COLOR_UTILITY})-${hue}((?:-\\d{2,3})?(?:\\/\\S+)?!?)$`,
      message: alias
        ? `"$0" uses a raw palette color. \`${alias}\` points at \`${hue}\`, use \`$1$2-${alias}$3\` instead.`
        : `"$0" uses a raw palette color. Point a color alias at \`${hue}\` in \`ui.colors\` and use the alias instead.`
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

// The `ui` of `app.config.ts` and of the Vite plugin. Only the paths that hold classes,
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
  // `:props` on `<UTheme>`, `{ button: { ui: { base } } }`
  { kind: 'attribute', name: '^v-bind:props$', match: [{ type: 'objectValues', path: '^[\\w-]+\\.ui\\..*$' }] },
  { kind: 'callee', name: '^(?:defineAppConfig|ui)$', match: APP_CONFIG_MATCHERS }
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
  const colors = { ...DEFAULT_COLORS, ...options.colors }
  const rules = {
    'no-unknown-classes': 'off',
    'no-palette-colors': 'warn',
    'no-conflicting-classes': 'warn',
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
      'better-tailwindcss/no-conflicting-classes': rules['no-conflicting-classes'],
      'better-tailwindcss/enforce-logical-properties': [rules['enforce-logical-properties'], { ignore: BLOCK_AXIS }]
    }
  }]
}
