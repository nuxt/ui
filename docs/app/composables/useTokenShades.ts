import { TOKEN_SHADE_TARGETS, SHADE_LADDER, tokenShadeDefaults } from '../utils/theme/engine/types'
import type { ColorAlias, ShadeStop } from '../utils/theme/engine/types'
import { readableShade } from '../utils/theme/engine/palette'

/**
 * Per-mode shade sliders for the semantic tokens riding one ramp, the accent
 * pair and text of a color alias, every neutral-ramped token for neutral.
 * Shared by the Colors panel sections and the Surfaces panel.
 */
export function useTokenShades(alias: ColorAlias) {
  const { style, setStyle, baselineDoc, paletteShades, rampChip } = useThemeStudio()

  /**
   * The active preset's own shade choices, what a row reset restores. Read as
   * written: a preset keeps its shades in the table, never as raw tokens.
   */
  const baselineShades = computed(() => baselineDoc.value.style?.tokenShades ?? {})

  // Only the touched mode is written, so an untouched mode never becomes an
  // override. Reset restores the BASELINE preset's shade, or deletes the entry
  // when the preset made no choice, a token's real default may not sit on the
  // ramp at all (--ui-bg-default is literally `white`).
  // A token that follows another shows that one's shade until it is set.
  function control(token: string, defaults: { light: ShadeStop, dark: ShadeStop }, target: 'light' | 'dark', follows?: string) {
    const model = computed({
      get: () => {
        const value = style.value.tokenShades?.[token]?.[target]
          ?? (follows ? style.value.tokenShades?.[follows]?.[target] : undefined)
          ?? defaults[target]
        // an older theme's off-ladder stop reads indexOf -1, clamp so the
        // slider stays grabbable
        return Math.max(0, SHADE_LADDER.indexOf(value as ShadeStop))
      },
      set: (index: number) => {
        setStyle({
          tokenShades: {
            ...style.value.tokenShades,
            [token]: { ...style.value.tokenShades?.[token], [target]: SHADE_LADDER[index]! }
          }
        })
      }
    })
    const baseline = computed(() => baselineShades.value[token]?.[target])
    const dirty = computed(() => style.value.tokenShades?.[token]?.[target] !== baseline.value)
    function reset() {
      const entry: { light?: ShadeStop, dark?: ShadeStop } = { ...style.value.tokenShades?.[token] }
      if (baseline.value !== undefined) entry[target] = baseline.value
      else Reflect.deleteProperty(entry, target)
      const tokenShades = { ...style.value.tokenShades }
      if (Object.keys(entry).length) tokenShades[token] = entry
      else Reflect.deleteProperty(tokenShades, token)
      setStyle({ tokenShades })
    }
    return { model, dirty, reset }
  }

  const sections = TOKEN_SHADE_TARGETS
    .filter(target => target.ramp === alias)
    .map(target => ({
      ...target,
      sliders: {
        light: control(target.token, target.defaults, 'light', target.follows),
        dark: control(target.token, target.defaults, 'dark', target.follows)
      }
    }))

  /**
   * The lightest shade of the ramp whose text reads at 4.5:1 in light mode,
   * on the page and on the color's tints, against the shades picked for both.
   */
  const readable = computed(() => {
    if (alias === 'neutral') return undefined
    const shades = paletteShades(rampChip(alias))
    const neutral = paletteShades(rampChip('neutral'))
    if (!shades || !neutral) return undefined
    const stop = (token: string) => style.value.tokenShades?.[token]?.light ?? tokenShadeDefaults(token).light
    const color = (ramp: typeof shades, value: ShadeStop) => value === 'white' ? '#ffffff' : value === 'black' ? '#000000' : ramp[value]
    const solid = color(shades, stop(`--ui-${alias}`))
    const page = color(neutral, stop('--ui-bg-default'))
    return solid && page ? readableShade(shades, solid, page) : undefined
  })

  const textTokens = [`--ui-${alias}-text-default`, `--ui-${alias}-text-muted`]

  /** Whether the light text and muted text already sit on the readable shade. */
  const readableApplied = computed(() => readable.value !== undefined
    && textTokens.every(token => style.value.tokenShades?.[token]?.light === readable.value))

  /** Set the light text and muted text to the readable shade, dark keeps following the color. */
  function applyReadable() {
    if (readable.value === undefined) return
    const tokenShades = { ...style.value.tokenShades }
    for (const token of textTokens) {
      tokenShades[token] = { ...tokenShades[token], light: readable.value }
    }
    setStyle({ tokenShades })
  }

  return { sections, readable, readableApplied, applyReadable }
}
