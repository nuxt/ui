<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, TOKEN_GROUPS, SHADE_LADDER, SHADE_LADDERS, storedStopStep, canonicalTokenShades } from '../../utils/theme-engine'
import type { ColorAlias, TokenGroup, ShadeStop } from '../../utils/theme-engine'

/**
 * Per-mode shade sliders for the semantic tokens of one ramp, grouped and
 * folded. Shared by the Colors panel (background/text on neutral) and the
 * Style panel's Borders section (the border group), so a token group can live
 * next to whichever control it belongs with.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Restrict to these token groups; omit to show every group with tokens. */
  groups?: TokenGroup[]
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

// Groups fold individually — all closed by default so the panel opens compact.
const tokenGroups = TOKEN_GROUPS
  .filter(group => !props.groups || props.groups.includes(group.key))
  .map(group => ({ ...group, sections: sections.filter(section => section.group === group.key) }))
  .filter(group => group.sections.length)
const openGroups = reactive<Record<string, boolean>>({})
</script>

<template>
  <div class="flex flex-col gap-1 pt-2">
    <UCollapsible v-for="tokenGroup in tokenGroups" :key="tokenGroup.key" v-model:open="openGroups[tokenGroup.key]">
      <UButton
        :label="tokenGroup.label"
        :icon="openGroups[tokenGroup.key] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        color="neutral"
        variant="ghost"
        size="sm"
        block
        :active="openGroups[tokenGroup.key]"
        active-variant="subtle"
        class="justify-start"
      />

      <template #content>
        <div class="flex flex-col gap-3 pt-2 pb-1 px-1">
          <div v-for="section in tokenGroup.sections" :key="section.token" class="flex flex-col gap-1.5">
            <span class="text-xs text-muted select-none">{{ section.label }}</span>

            <ThemeStudioSliderRow
              v-for="(slider, modeName) in section.sliders"
              :key="modeName"
              v-model="slider.model.value"
              :mode="modeName"
              :chip="rampChip(section.ramp)"
              :ladder="shadeLadder"
              resettable
              :dirty="slider.dirty.value"
              @reset="slider.reset()"
            />
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
