<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, SHADE_LADDER, SHADE_LADDERS, storedStopStep, canonicalTokenShades } from '../../utils/theme-engine'
import type { ColorAlias, SectionKey, ShadeStop } from '../../utils/theme-engine'

/**
 * One color alias in the Colors panel: a section header carrying the edit
 * and adjust-shades toggles, the picker below, and the palette editor /
 * shade sliders folding out underneath. Color aliases expose their accent
 * pair; neutral carries every neutral-ramped token group.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Header text — defaults to the capitalized alias. */
  label?: string
  helpTo?: string
  /** Passed through to the section header's reset affordance. */
  sectionKey?: SectionKey
}>()

const { style, setStyle, rampChip, baselineDoc, isCustomPalette, paletteParams } = useThemeStudio()

/** The active preset's own shade choices — what a row reset restores. */
const baselineShades = computed(() => canonicalTokenShades(baselineDoc.value))

// A custom palette's tokens can pick every stop its density emits — the
// sliders (and their model mapping) span that ladder, up to 91 stops. Stock
// ramps only define the standard 11, so they stay on the short ladder.
const shadeLadder = computed<readonly ShadeStop[]>(() => (isCustomPalette(props.alias)
  ? SHADE_LADDERS[storedStopStep(paletteParams.value[props.alias])]
  : SHADE_LADDER))

const title = computed(() => props.label ?? capitalize(props.alias))

const paletteEditor = ref(false)
const shadeEditor = ref(false)

// Per-token shade sliders, one light/dark pair. Only the touched mode is
// written so an untouched mode never becomes an override. Dirty and reset
// measure against the BASELINE preset's own choice for the token: reset
// restores the preset's shade, or deletes the override entirely when the
// preset made no choice (the token's real default may not sit on the ramp
// at all — --ui-bg is literally `white` — so writing a "default shade"
// would pin a lookalike override over it).
function tokenShadeControl(token: string, defaults: { light: ShadeStop, dark: ShadeStop }, target: 'light' | 'dark') {
  const model = computed({
    get: () => {
      const value = style.value.tokenShades?.[token]?.[target] ?? defaults[target]
      // A stop chosen at a finer density, then coarsened away, no longer sits
      // on the ladder (indexOf -1) — clamp to 0 so the slider stays grabbable.
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
  .filter(target => props.alias === 'neutral' ? target.ramp === 'neutral' : target.token === `--ui-${props.alias}`)
  .map(target => ({
    ...target,
    sliders: {
      light: tokenShadeControl(target.token, target.defaults, 'light'),
      dark: tokenShadeControl(target.token, target.defaults, 'dark')
    }
  }))
</script>

<template>
  <ThemeStudioSection :label="title" :help-to="helpTo" :section-key="sectionKey">
    <template #actions>
      <UTooltip text="Adjust shades">
        <UButton
          icon="i-lucide-settings-2"
          color="neutral"
          variant="ghost"
          size="xs"
          :active="shadeEditor"
          active-color="primary"
          active-variant="subtle"
          :aria-label="`Adjust ${alias} shades`"
          @click="shadeEditor = !shadeEditor"
        />
      </UTooltip>
      <UTooltip text="Edit palette">
        <UButton
          icon="i-lucide-tangent"
          color="neutral"
          variant="ghost"
          size="xs"
          :active="paletteEditor"
          active-color="primary"
          active-variant="subtle"
          :aria-label="`Edit ${alias} palette`"
          @click="paletteEditor = !paletteEditor"
        />
      </UTooltip>
    </template>

    <div>
      <ThemeStudioColorMenu :alias="alias" />

      <ThemeStudioPaletteEditor v-model:open="paletteEditor" :alias="alias" />

      <!-- The accent pair for color aliases. -->
      <div v-if="shadeEditor && alias !== 'neutral'" class="flex flex-col gap-1.5 pt-2">
        <ThemeStudioSliderRow
          v-for="(slider, modeName) in sections[0]!.sliders"
          :key="modeName"
          v-model="slider.model.value"
          :mode="modeName"
          :chip="rampChip(alias)"
          :ladder="shadeLadder"
          resettable
          :dirty="slider.dirty.value"
          @reset="slider.reset()"
        />
      </div>

      <!-- Every neutral-ramped semantic token — background and text; borders
           moved to the Style panel's Borders section. -->
      <ThemeStudioTokenShades v-else-if="shadeEditor" :alias="alias" :groups="['background', 'text']" />
    </div>
  </ThemeStudioSection>
</template>
