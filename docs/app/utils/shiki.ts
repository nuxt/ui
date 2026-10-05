import type { ShikiTransformer, ThemedToken } from '@shikijs/types'
import { splitToken } from 'shiki/core'
import colors from 'tailwindcss/colors'
import { defaultGetForegroundColor, transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

interface PaletteUsage {
  start: number
  end: number
  light: string
  dark: string
}

const swatchStyle = {
  'display': 'inline-block',
  'padding': '0 0.15em',
  'margin': '0 -0.15em',
  'border-radius': '0.2em'
}

const isShade = (word: string) => word === 'black' || word === 'white' || /^(?:50|[1-9]00|950)$/.test(word)

// `light-dark()` follows the `color-scheme` Nuxt UI sets on `.dark`
const lightDark = (light: string, dark: string) => light === dark ? light : `light-dark(${light}, ${dark})`

/**
 * The palettes named in a `@plugin "@nuxt/ui/colors"` block, each with the
 * shades its alias uses in light and dark mode, read like the plugin does.
 */
function detectPaletteUsage(code: string): PaletteUsage[] {
  const usages: PaletteUsage[] = []

  for (const block of code.matchAll(/@plugin\s+["']@nuxt\/ui\/colors["']\s*\{([^}]*)\}/g)) {
    const blockStart = block.index + block[0].indexOf('{') + 1

    for (const line of block[1]!.matchAll(/([\w-]+)(:\s*)([a-z][\w-]*)((?:\s+\w+)*)\s*;/g)) {
      const [, alias, separator, palette, rest] = line as unknown as [string, string, string, string, string]
      if (isShade(palette)) continue

      const defaults = alias === 'neutral' ? ['900', '50'] : ['500', '400']
      // Shades come in pairs, light then dark, or not at all
      const [light, dark, ...extra] = rest.trim() ? rest.trim().split(/\s+/) : defaults
      if (!light || !dark || extra.length || !isShade(light) || !isShade(dark)) continue

      // A palette declared in the same block's `@theme` counts too
      const value = (shade: string) => shade === 'black' || shade === 'white'
        ? shade
        : (colors as unknown as Record<string, Record<string, string> | undefined>)[palette]?.[shade]
          ?? code.match(new RegExp(`--color-${palette}-${shade}:\\s*([^;]+);`))?.[1]?.trim()
      const lightValue = value(light)
      const darkValue = value(dark)
      if (!lightValue || !darkValue) continue

      const start = blockStart + line.index + alias.length + separator.length
      usages.push({ start, end: start + palette.length, light: lightValue, dark: darkValue })
    }
  }

  return usages
}

// `primary: blue` in the plugin is Tailwind's blue at the alias's shades, `500`
// in light mode and `400` in dark mode unless the line gives others
const transformerPaletteHighlight = (): ShikiTransformer => {
  const map = new WeakMap<object, PaletteUsage[]>()

  return {
    name: 'palette-highlight',
    preprocess(code) {
      if (this.options.lang === 'css') {
        map.set(this.meta, detectPaletteUsage(code))
      }
    },
    tokens(tokens) {
      const usages = map.get(this.meta)
      if (!usages?.length) return

      return tokens.map((line) => {
        const result: ThemedToken[] = []
        for (const token of line) {
          const end = token.offset + token.content.length
          const breakpoints = usages.flatMap(usage => [usage.start, usage.end]).filter(offset => token.offset < offset && offset < end)
          for (const part of splitToken(token, breakpoints.map(offset => offset - token.offset))) {
            const usage = usages.find(usage => usage.start <= part.offset && part.offset + part.content.length <= usage.end)
            const previous = result.at(-1)
            if (!usage) {
              result.push(part)
            } else if (previous?.bgColor && usage.start <= previous.offset) {
              // The grammar may cut a name in two, one swatch covers it
              previous.content += part.content
            } else {
              const color = lightDark(defaultGetForegroundColor(usage.light) ?? 'inherit', defaultGetForegroundColor(usage.dark) ?? 'inherit')
              const bgColor = lightDark(usage.light, usage.dark)
              result.push({
                offset: part.offset,
                content: part.content,
                bgColor,
                color,
                htmlStyle: { 'background-color': bgColor, color, ...swatchStyle }
              })
            }
          }
        }
        return result
      })
    }
  }
}

// The content pipeline turns a swatch's inline style into a generated class,
// so this names it for the dark mode rule in main.css to skip
const transformerColorHighlightClass = (): ShikiTransformer => ({
  name: 'color-highlight-class',
  span(hast, _line, _col, _lineElement, token) {
    if (token.bgColor) {
      this.addClassToHast(hast, 'shiki-color-highlight')
    }
  }
})

/**
 * A swatch on colour values, the glyph on icon names. Read by the content
 * pipeline (mdc.config.ts) and by the runtime parser (utils/markdown.ts), so
 * a code block is marked up the same wherever it was parsed.
 */
export const shikiTransformers = (): ShikiTransformer[] => [
  // A bare name is a Tailwind palette here (`primary: violet`), which the CSS
  // keyword of the same name doesn't match, so only literal values get a swatch
  // from this one. The next gives the plugin's palettes theirs.
  transformerColorHighlight({ getForegroundColor: color => /^[a-z]+$/i.test(color) ? null : defaultGetForegroundColor(color) }) as ShikiTransformer,
  transformerPaletteHighlight(),
  transformerIconHighlight(),
  transformerColorHighlightClass()
]
