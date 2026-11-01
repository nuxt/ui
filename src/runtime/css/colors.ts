import { readFileSync } from 'node:fs'
import plugin from 'tailwindcss/plugin'
import tailwindColors from 'tailwindcss/colors'
import { colorName, colors } from '../theme/color'
import type { Color } from '../theme/color'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * A palette name, optionally followed by the two shades the alias uses, for
 * light then dark mode. A name outside the built-in aliases adds a color.
 */
export type ColorsOptions = Partial<Record<Color, string>> & Record<string, string | undefined>

// Names a color can't take beyond the ones a color utility already has: CSS
// keywords Tailwind has utilities for, and variables Nuxt UI sets under `--ui-<name>`
const reserved = ['inherit', 'current', 'transparent', 'highlight', 'layer']

let tokenNames: Set<string> | undefined

/**
 * The names Nuxt UI's color utilities already have, like `muted` in
 * `text-muted` or `accent` in `bg-accent-soft`, read from `tokens.css` next to
 * this file. Read before the theme is: the color a name adds is in it by then.
 */
function getTokenNames() {
  if (!tokenNames) {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')
    tokenNames = new Set()
    for (const [, name] of css.matchAll(/^\s*--(?:color|text-color|background-color|border-color|ring-color|ring-offset-color|divide-color|outline-color|stroke|fill)-([\w-]+):/gm)) {
      const words = name!.split('-')
      words.forEach((_, i) => tokenNames!.add(words.slice(0, i + 1).join('-')))
    }
  }
  return tokenNames
}

// A name whose utilities Tailwind CSS or Nuxt UI already has, like `white` or `muted`
const isTaken = (alias: string) => reserved.includes(alias) || alias in tailwindColors || getTokenNames().has(alias)

// Compared as written: `050` would pass as a number but name no variable
const isShade = (word: string) => word === 'black' || word === 'white' || shades.some(shade => String(shade) === word)

// `black` and `white` aren't shades of a palette, so they are the color itself
const shadeValue = (alias: string, shade: string) => shade === 'black' || shade === 'white' ? shade : `var(--ui-color-${alias}-${shade})`

// Tailwind's gray palettes. An alias on one of them, or on the palette `neutral`
// uses, is a monochrome color: it takes neutral's surface roles, see below.
const grays = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']

let neutralRoles: Array<[role: string, value: string]> | undefined

/**
 * The roles the neutral scope points at the surface tokens, read from
 * `accent.css` next to this file so the two can't drift. A role neutral leaves
 * to its recipe, like `text-contrast`, isn't listed. Read from this module's own URL:
 * the runtime ships file by file, so it sits next to `accent.css` in `dist` too.
 */
function getNeutralRoles() {
  if (!neutralRoles) {
    const css = readFileSync(new URL('./accent.css', import.meta.url), 'utf8')
    const scope = css.match(/\.\\\[--ui-accent\\:var\\\(--ui-neutral\\\)\\\]\s*\{([^}]*)\}/)?.[1] ?? ''
    neutralRoles = [...scope.matchAll(/--ui-accent-([\w-]+): var\(--ui-neutral-\1, (\S.*)\);/g)].map(([, role, value]) => [role!, value!])
    // None found means `accent.css` no longer reads the way this parses it
    if (!neutralRoles.length) {
      throw new Error('[@nuxt/ui] Found no neutral roles in `accent.css`.')
    }
  }
  return neutralRoles
}

let accentRoles: string[] | undefined

/**
 * The roles a color's scope points at its own variables, `--ui-accent-<role>`
 * at `--ui-<color>-<role>`, read from `primary`'s scope in `accent.css` like
 * neutral's above, for the scope of a color added here.
 */
function getAccentRoles() {
  if (!accentRoles) {
    const css = readFileSync(new URL('./accent.css', import.meta.url), 'utf8')
    const scope = css.match(/\.\\\[--ui-accent\\:var\\\(--ui-primary\\\)\\\]\s*\{([^}]*)\}/)?.[1] ?? ''
    accentRoles = [...scope.matchAll(/--ui-accent-([\w-]+): var\(--ui-primary-\1\);/g)].map(([, role]) => role!)
    if (!accentRoles.length) {
      throw new Error('[@nuxt/ui] Found no accent roles in `accent.css`.')
    }
  }
  return accentRoles
}

// The selector of a scope class, like `[--ui-accent:var(--ui-tertiary)]`
const scopeSelector = (variable: string, color: string) => `.\\[--${variable}\\:var\\(--ui-${color}\\)\\]`

// Edits between two words, for the palette a typo was probably meant as
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const next = [i]
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(next[j - 1]! + 1, row[j]! + 1, row[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    row = next
  }
  return row[b.length]!
}

// `theme('colors')` lists every shade flat, like `red-500`
function closestPalette(name: string, shadesByName: unknown) {
  let closest: string | undefined
  let closestDistance = 3
  for (const key of Object.keys(shadesByName ?? {})) {
    const palette = key.match(/^(.+)-500$/)?.[1]
    if (!palette || palette === name || (palette !== 'neutral' && (colors as readonly string[]).includes(palette))) {
      continue
    }
    const edits = distance(name, palette)
    if (edits < closestDistance) {
      closest = palette
      closestDistance = edits
    }
  }
  return closest
}

/**
 * Points the color aliases at Tailwind palettes, one line per alias:
 * `@plugin "@nuxt/ui/colors" { primary: indigo; neutral: zinc; }`. Each writes
 * the alias's shades (`--ui-color-primary-50` to `950`) with the palette's
 * values, resolved when Tailwind compiles, so a prefixed or customized palette
 * works too.
 *
 * The shades an alias uses follow the palette, `500` in light mode and `400`
 * in dark mode by default (`900` and `50` for `neutral`): `primary: neutral
 * 900 200` picks others, always both, `black` and `white` work as shades,
 * and shades alone (`primary: black white`) keep the palette.
 *
 * The defaults are plain CSS in `base.css`, at zero specificity, so the
 * aliases you set win wherever you register it.
 *
 * A name outside the built-in aliases adds a color, `tertiary: indigo`, with
 * the same shades and defaults: the plugin also writes its scopes and its
 * utilities (`bg-tertiary`, `text-tertiary`), and every `color` prop takes it.
 */
// The palette an alias's value names, if any
const paletteOf = (value?: string) => {
  const word = value && String(value).replace(/["']/g, '').trim().split(/\s+/)[0]
  return word && !isShade(word) ? word : undefined
}

// A name outside the built-in aliases adds a color
const isAdded = (alias: string) => !(colors as readonly string[]).includes(alias)

// The utilities of a color added here, `bg-tertiary` to `bg-tertiary-950`, and
// `text-tertiary` on its strong text like the built-in colors in `tokens.css`
function bridge(alias: string) {
  return {
    colors: { DEFAULT: `var(--ui-${alias})`, ...Object.fromEntries(shades.map(shade => [shade, `var(--ui-color-${alias}-${shade})`])) },
    textColor: `var(--ui-${alias}-text-strong, var(--ui-${alias}-text-default, var(--ui-${alias})))`
  }
}

const colorsPlugin: ReturnType<typeof plugin.withOptions<ColorsOptions>> = plugin.withOptions<ColorsOptions>(options => ({ addBase, theme }) => {
  const aliases: Record<string, string | undefined> = options ?? {}

  const declarations: Record<string, string> = {}
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}
  const scopes: Record<string, Record<string, string>> = {}
  // Every color is checked before one error lists them all, to fix them in one save
  const errors: Error[] = []
  for (const [alias, value] of Object.entries(aliases)) {
    try {
      const added = isAdded(alias)
      if (added) {
        if (!colorName.test(alias)) {
          throw new Error(`[@nuxt/ui] \`${alias}\` can't name a color: use lowercase words joined by dashes, like \`tertiary\` or \`brand-dark\`.`)
        }
        // The utilities this color adds would take over ones that exist
        if (isTaken(alias)) {
          throw new Error(`[@nuxt/ui] \`${alias}\` can't name a color: Tailwind CSS or Nuxt UI already uses it, like \`bg-${alias}\` or \`text-${alias}\`. Pick another name, like \`tertiary\`.`)
        }
      }
      if (!value) {
        if (added) {
          throw new Error(`[@nuxt/ui] \`${alias}\` needs a palette, like \`${alias}: indigo\`.`)
        }
        continue
      }
      const words = String(value).replace(/["']/g, '').trim().split(/\s+/)
      // The palette is optional: shades alone keep the alias's palette
      const palette = isShade(words[0]!) ? undefined : words.shift()
      const [lightShade, darkShade, ...rest] = words
      if (lightShade) {
        // Both or none: a shade that suits one mode rarely suits the other
        if (!darkShade || rest.length || ![lightShade, darkShade].every(shade => isShade(shade))) {
          throw new Error(`[@nuxt/ui] \`${alias}: ${value}\` takes a palette and two shades, for light then dark mode, from ${shades.join(', ')}, \`black\` or \`white\`, like \`${alias}: indigo 600 300\`.`)
        }
        light[`--ui-${alias}`] = shadeValue(alias, lightShade)
        dark[`--ui-${alias}`] = shadeValue(alias, darkShade)
      } else if (added) {
        // The shades the built-in colors default to in `base.css`
        light[`--ui-${alias}`] = shadeValue(alias, '500')
        dark[`--ui-${alias}`] = shadeValue(alias, '400')
      }
      if (added) {
        // The scopes components put on an element for this color, which the
        // engine builds from its name, so no stylesheet lists them for Tailwind
        // to find: each rule sets its variable itself. The accent scope also
        // points the roles at this color's own, like `primary`'s in `accent.css`.
        scopes[scopeSelector('ui-accent', alias)] = {
          '--ui-accent': `var(--ui-${alias})`,
          ...Object.fromEntries(getAccentRoles().map(role => [`--ui-accent-${role}`, `var(--ui-${alias}-${role})`]))
        }
        scopes[scopeSelector('ui-highlight', alias)] = { '--ui-highlight': `var(--ui-${alias})` }
        scopes[scopeSelector('spotlight-color', alias)] = { '--spotlight-color': `var(--ui-${alias})` }
      }
      if (!palette) {
        if (added) {
          throw new Error(`[@nuxt/ui] \`${alias}: ${value}\` needs a palette, like \`${alias}: indigo ${words.join(' ')}\`: an added color has no default one.`)
        }
        continue
      }
      // A color value like `#5865f2` or `oklch(...)` isn't a palette: the alias
      // itself takes it, as a CSS variable
      if (/^#|\(/.test(palette)) {
        throw new Error(`[@nuxt/ui] \`${alias}: ${palette}\` takes a palette name, not a color. To use a color of your own, set \`--ui-${alias}\` in your CSS, or declare a palette in \`@theme\` and give its name.`)
      }
      // An alias's palette is the alias itself (`--color-primary-500` reads
      // `--ui-color-primary-500`), so pointing one at another loops
      if ((added && palette === alias) || (palette !== 'neutral' && (colors as readonly string[]).includes(palette))) {
        throw new Error(`[@nuxt/ui] \`${alias}: ${palette}\` points a color alias at another. Give it a Tailwind palette, like \`indigo\`.`)
      }
      // Nuxt UI's `neutral` alias takes over `--color-neutral-*`, so Tailwind's
      // own neutral palette is read from its package
      for (const shade of shades) {
        const value = palette === 'neutral' ? tailwindColors.neutral[shade] : theme(`colors.${palette}.${shade}`)
        if (typeof value !== 'string') {
          const palettes = theme('colors')
          if (!palettes || !Object.keys(palettes).length) {
            throw new TypeError(`[@nuxt/ui] \`${alias}: ${palette}\` can't be read: Tailwind CSS's theme isn't loaded in this stylesheet. Import \`tailwindcss\` before the plugin, or in a stylesheet that only adds colors, like a layer's, \`@import "tailwindcss/theme" theme(reference);\`.`)
          }
          if (typeof theme(`colors.${palette}.500`) === 'string') {
            throw new TypeError(`[@nuxt/ui] \`${alias}: ${palette}\` needs every shade of \`${palette}\` from 50 to 950, and \`--color-${palette}-${shade}\` is missing.`)
          }
          const closest = closestPalette(palette, palettes)
          // The suggestion first, for a log that only shows the start of the message
          throw new TypeError(`[@nuxt/ui] \`${alias}: ${palette}\` isn't a Tailwind palette${closest ? `, did you mean \`${closest}\`?` : '.'} A palette has shades from 50 to 950, like \`indigo\`, or is one you declare in \`@theme\` as \`--color-<name>-50\` to \`-950\`.`)
        }
        declarations[`--ui-color-${alias}-${shade}`] = value
      }
    } catch (error) {
      errors.push(error as Error)
    }
  }
  if (errors.length > 1) {
    throw new Error(errors.map(error => error.message).join('\n'))
  }
  if (errors[0]) {
    throw errors[0]
  }

  if (Object.keys(declarations).length) {
    addBase({ ':root, :host': declarations })
  }
  if (Object.keys(scopes).length) {
    addBase(scopes)
  }

  // An alias on a gray takes neutral's roles, like `color="neutral"`: soft,
  // subtle and ghost variants on the neutral fills, not tinted by the gray.
  // Set as its per-color roles, so an override of those still wins.
  const neutralPalette = paletteOf(aliases.neutral) ?? 'gray'
  const roles: Record<string, string> = {}
  for (const [alias, value] of Object.entries(aliases)) {
    const palette = paletteOf(value)
    if (alias === 'neutral' || !palette || (!grays.includes(palette) && palette !== neutralPalette)) {
      continue
    }
    for (const [role, fallback] of getNeutralRoles()) {
      roles[`--ui-${alias}-${role}`] = fallback.replace(/var\(--ui-neutral\)/g, `var(--ui-${alias})`)
    }
  }
  if (Object.keys(roles).length) {
    addBase({ ':root, :host, .light, .dark': roles })
  }
  // After the palettes, `.dark` last so it wins on a dark root
  if (Object.keys(light).length) {
    addBase({ ':root, :host, .light': light })
    addBase({ '.dark': dark })
  }
}, (options) => {
  const added = Object.keys(options ?? {}).filter(alias => isAdded(alias) && colorName.test(alias) && !isTaken(alias))
  if (!added.length) {
    return {}
  }
  return {
    theme: {
      extend: {
        colors: Object.fromEntries(added.map(alias => [alias, bridge(alias).colors])),
        textColor: Object.fromEntries(added.map(alias => [alias, bridge(alias).textColor]))
      }
    }
  }
})

export default colorsPlugin
