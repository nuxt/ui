import { TOKEN_SHADE_TARGETS, SHADE_LADDER, SHADE_LADDERS, storedStopStep, canonicalTokenShades } from '../utils/theme/engine'
import type { ColorAlias, ShadeStop } from '../utils/theme/engine'

/**
 * Per-mode shade sliders for the semantic tokens riding one ramp, the accent
 * pair for a color alias, every neutral-ramped token for neutral. Shared by
 * the Colors panel section and the folded token groups.
 */
export function useTokenShades(alias: ColorAlias) {
  const { style, setStyle, baselineDoc, isCustomPalette, paletteParams } = useThemeStudio()

  /** The active preset's own shade choices, what a row reset restores. */
  const baselineShades = computed(() => canonicalTokenShades(baselineDoc.value))

  // A custom palette's tokens can pick every stop its density emits, the
  // sliders (and their model mapping) span that ladder, up to 91 stops. Stock
  // ramps only define the standard 11, so they stay on the short ladder.
  const shadeLadder = computed<readonly ShadeStop[]>(() => (isCustomPalette(alias)
    ? SHADE_LADDERS[storedStopStep(paletteParams.value[alias])]
    : SHADE_LADDER))

  // Only the touched mode is written, so an untouched mode never becomes an
  // override. Reset restores the BASELINE preset's shade, or deletes the entry
  // when the preset made no choice, a token's real default may not sit on the
  // ramp at all (--ui-bg is literally `white`).
  function control(token: string, defaults: { light: ShadeStop, dark: ShadeStop }, target: 'light' | 'dark') {
    const model = computed({
      get: () => {
        const value = style.value.tokenShades?.[token]?.[target] ?? defaults[target]
        // a stop coarsened off the ladder reads indexOf -1, clamp so the
        // slider stays grabbable
        return Math.max(0, shadeLadder.value.indexOf(value as ShadeStop))
      },
      set: (index: number) => {
        setStyle({
          tokenShades: {
            ...style.value.tokenShades,
            [token]: { ...style.value.tokenShades?.[token], [target]: shadeLadder.value[index]! }
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
    .filter(target => alias === 'neutral' ? target.ramp === 'neutral' : target.token === `--ui-${alias}`)
    .map(target => ({
      ...target,
      sliders: {
        light: control(target.token, target.defaults, 'light'),
        dark: control(target.token, target.defaults, 'dark')
      }
    }))

  return { shadeLadder, sections }
}
