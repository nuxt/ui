import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useHead } from '#imports'
import { colors } from '../theme/color'
import type { Color } from '../theme/color'

const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const

type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

/** A palette, like the ones `tailwindcss/colors` exports. */
export type ThemeColorScale = { [S in Shade]?: string }

export interface UseThemeOptions {
  /**
   * The palette of each color alias, or for all but `neutral` a single color,
   * which sets the alias without its shades (`bg-primary-600` keeps its own).
   * `neutral` takes a palette, since the surfaces use its shades.
   * @example { primary: colors.indigo, secondary: '#5647ff' }
   */
  colors?: { [C in Exclude<Color, 'neutral'>]?: string | ThemeColorScale } & { neutral?: ThemeColorScale }
  /**
   * The base radius the `rounded-*` utilities derive from.
   * @example '0.375rem'
   */
  radius?: string
}

// A value lands in a `<style>` tag, often from a database, so anything that
// could close the rule or the tag, or swallow the next declarations, is refused
// rather than escaped
function isSafe(value: string): boolean {
  if (/[;{}<>\\"']/.test(value) || value.includes('/*')) {
    return false
  }
  let depth = 0
  for (const char of value) {
    depth += char === '(' ? 1 : char === ')' ? -1 : 0
    if (depth < 0) {
      return false
    }
  }
  return depth === 0
}

/** @internal */
export function themeToCSS(options: UseThemeOptions = {}): string {
  const declarations: string[] = []
  const set = (name: string, value: unknown) => {
    if (typeof value !== 'string' || !value) {
      return
    }
    if (!isSafe(value)) {
      if (import.meta.dev) {
        console.warn(`[@nuxt/ui] \`useTheme\` ignored \`${name}: ${value}\`, which isn't a CSS value.`)
      }
      return
    }
    declarations.push(`${name}: ${value};`)
  }

  for (const [alias, value] of Object.entries(options.colors ?? {})) {
    if (!(colors as readonly string[]).includes(alias)) {
      continue
    }
    if (typeof value === 'string') {
      if (alias !== 'neutral') {
        set(`--ui-${alias}`, value)
      } else if (import.meta.dev) {
        console.warn('[@nuxt/ui] `useTheme` ignored the single color of `neutral`, which takes a palette since the surfaces use its shades.')
      }
    } else if (value) {
      // Only the known shades, since a key would land in the property name
      for (const shade of shades) {
        set(`--ui-color-${alias}-${shade}`, (value as Record<string, unknown>)[shade])
      }
    }
  }
  set('--ui-radius', options.radius)

  // Unlayered, so it wins over the palettes set in CSS and over dark mode: a
  // single color applies in both, on nested `.light` and `.dark` elements too,
  // and a palette keeps its light and dark shades
  return declarations.length ? `:root, :host, .light, .dark {\n  ${declarations.join('\n  ')}\n}` : ''
}

/**
 * Change the colors and the radius of your app at runtime, for example per
 * tenant from the server or from a color picker. It renders a `<style>` in the
 * head, server-side too, updates when the options change, and goes away with
 * the component that calls it.
 * @see https://ui.nuxt.com/docs/composables/use-theme
 */
export function useTheme(options: MaybeRefOrGetter<UseThemeOptions>) {
  useHead(() => {
    const css = themeToCSS(toValue(options))
    // After the stylesheets, so it wins over the app's own `:root` rules the
    // same way on the server and in the browser
    return css ? { style: [{ innerHTML: css, tagPriority: 'low' }] } : {}
  })
}
