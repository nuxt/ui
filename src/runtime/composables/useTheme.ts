import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useHead } from '#imports'
import { colors } from '../theme/color'
import type { Color } from '../theme/color'

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

// A value lands in a `<style>` tag, so anything that could close the rule or
// the tag is refused rather than escaped
const UNSAFE = /[;{}<>]/

/** @internal */
export function themeToCSS(options: UseThemeOptions = {}): string {
  const declarations: string[] = []
  const set = (name: string, value: unknown) => {
    if (typeof value !== 'string' || !value) {
      return
    }
    if (UNSAFE.test(value)) {
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
      }
    } else if (value) {
      for (const [shade, color] of Object.entries(value)) {
        set(`--ui-color-${alias}-${shade}`, color)
      }
    }
  }
  set('--ui-radius', options.radius)

  // Unlayered, so it wins over the palettes set in CSS and over dark mode:
  // a single color applies in both, a palette keeps its light and dark shades
  return declarations.length ? `:root, :host {\n  ${declarations.join('\n  ')}\n}` : ''
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
    return css ? { style: [{ innerHTML: css }] } : {}
  })
}
