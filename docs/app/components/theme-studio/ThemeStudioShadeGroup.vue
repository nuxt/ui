<script setup lang="ts">
import { SHADE_LADDER } from '../../utils/theme-engine'
import type { ShadeStop } from '../../utils/theme-engine'

/**
 * A section of per-mode shade sliders that reset as one group, the sliders
 * carry their own dirty state, so no call site has to fold it by hand.
 */
export interface ShadeSlider {
  model: { value: number }
  dirty: { value: boolean }
  reset: () => void
}

const props = withDefaults(defineProps<{
  label?: string
  /** Omit for a group whose rows come from its slot instead. */
  sliders?: Record<'light' | 'dark', ShadeSlider>
  /** Palette the stops resolve against. */
  chip?: string
  ladder?: readonly ShadeStop[]
  separator?: boolean
  /** A colour source with no shades keeps its group, minus the sliders. */
  showRows?: boolean
}>(), {
  separator: undefined,
  showRows: true,
  ladder: () => SHADE_LADDER
})

const dirty = computed(() => Object.values(props.sliders ?? {}).some(slider => slider.dirty.value))

function reset() {
  Object.values(props.sliders ?? {}).forEach(slider => slider.reset())
}
</script>

<template>
  <ThemeStudioSection
    :label="label"
    :separator="separator"
    :resettable="!!sliders"
    :reset-dirty="dirty"
    @reset="reset"
  >
    <!-- whatever picks the colour these stops ride -->
    <slot />

    <ThemeStudioRow
      v-for="(slider, mode) in sliders ?? {}"
      v-show="showRows"
      :key="mode"
      v-model="slider.model.value"
      control="shade"
      :mode="mode"
      :chip="chip"
      :ladder="ladder"
    />
  </ThemeStudioSection>
</template>
