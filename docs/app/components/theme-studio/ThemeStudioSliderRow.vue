<script setup lang="ts">
import { SHADES } from '../../utils/theme-engine'

/**
 * The studio's control row — a horizontal UFormField: tiny label (or icon),
 * slider, monospace readout. With `chip` + `mode` it becomes a shade
 * slider: the fill and swatch wear the ramp color at the selected shade,
 * and the readout names the shade.
 */
const props = withDefaults(defineProps<{
  /** Names the slider (aria) — shown unless an icon or chip replaces it. */
  label?: string
  /** Rendered in place of the label text. */
  icon?: string
  min?: number
  max?: number
  step?: number
  /** Readout suffix (%, px, rem, °). */
  unit?: string
  /** Palette chip name — turns the row into a shade slider… */
  chip?: string
  /** …for this color mode. */
  mode?: 'light' | 'dark'
  /**
   * Shows a per-row reset button, enabled while an override exists.
   * Emits `reset` — the host deletes its override (true absence, not
   * "write the default value", which would pin a lookalike override).
   */
  resettable?: boolean
  dirty?: boolean
}>(), {
  min: 0,
  max: SHADES.length - 1,
  step: 1
})

/** Plain rows: the value itself. Shade rows: an index into SHADES. */
const value = defineModel<number>({ required: true })

const shade = computed(() => !!props.chip && !!props.mode)
const sliderColor = computed(() => shade.value ? `var(--color-${props.chip}-${SHADES[value.value]})` : undefined)

/**
 * A border that always contrasts with the fill, derived FROM the fill:
 * relative color syntax steps lightness to near-black on light fills and
 * near-white on dark ones (the ×1000 turns the difference into a hard
 * switch the clamp bounds).
 */
const contrastColor = computed(() => shade.value
  ? `oklch(from ${sliderColor.value} clamp(0.12, (0.66 - l) * 1000, 0.95) 0 h / 0.65)`
  : undefined)

const emit = defineEmits<{ reset: [] }>()

/** `0.25rem` reads as `.25rem` — the leading zero is noise at this width. */
const display = computed(() => shade.value
  ? String(SHADES[value.value])
  : `${String(value.value).replace(/^(-?)0\./, '$1.')}${props.unit ?? ''}`)
</script>

<template>
  <UFormField
    :label="icon || shade ? undefined : label"
    orientation="horizontal"
    size="xs"
    :style="sliderColor ? { '--slider-color': sliderColor, '--slider-contrast': contrastColor } : undefined"
    :ui="{
      root: 'flex items-center gap-2',
      wrapper: 'w-13 shrink-0',
      /* truncate only text labels — its overflow:hidden would clip the
         shade chip's ring once thick-border themes inflate it */
      label: `w-full text-muted font-normal select-none${icon || shade ? '' : ' truncate'}`,
      container: 'flex-1 flex items-center gap-2 mt-0'
    }"
  >
    <template v-if="icon || shade" #label>
      <UIcon v-if="icon" :name="icon" class="size-3.5 text-muted" />

      <span v-else class="flex items-center gap-1.5 w-full">
        <UIcon :name="mode === 'light' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-3.5 text-muted shrink-0" />
        <span class="h-3 w-6 grow rounded-sm bg-(--slider-color) ring ring-(--slider-contrast) me-px" />
      </span>
    </template>

    <!-- Shade fills keep a hairline inset ring so a color matching the
         panel background never makes the slider vanish. -->
    <USlider
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      color="primary"
      size="xs"
      :aria-label="label ?? mode"
      :ui="sliderColor ? {
        range: 'bg-(--slider-color) inset-ring inset-ring-(--slider-contrast)',
        thumb: 'bg-(--slider-color) ring-1 ring-(--slider-contrast) shadow-sm'
      } : undefined"
    />

    <span class="text-xs text-dimmed font-mono w-8 text-right shrink-0 truncate" :title="display">{{ display }}</span>

    <UButton
      v-if="resettable"
      icon="i-lucide-rotate-ccw"
      size="xs"
      :color="dirty ? 'primary' : 'neutral'"
      variant="ghost"
      :disabled="!dirty"
      :ui="{ leadingIcon: 'size-3' }"
      :aria-label="`Reset ${label ?? mode}`"
      @click="emit('reset')"
    />
  </UFormField>
</template>
