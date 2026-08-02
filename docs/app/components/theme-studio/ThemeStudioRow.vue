<script setup lang="ts">
import { SHADE_LADDER } from '../../utils/theme-engine'
import type { ShadeStop } from '../../utils/theme-engine'
import type { ChipProps } from '@nuxt/ui'

/**
 * The studio's control row. Every settings row in every panel is this
 * component: a tiny label (or icon, or shade chip), then the control, all on
 * one 28px line so a row of sliders, switches and selects share a baseline.
 *
 * `control` picks what sits in the row:
 *  - slider  a value slider with a typeable readout and optional reset
 *  - switch  a toggle, pushed to the far end (its label reads as a sentence)
 *  - select  a ThemeStudioDefaultSelect over `items`
 *  - custom  whatever the default slot provides (variant grids, pickers)
 */
export interface RowSelectItem {
  label: string
  value: string
  defaultTag?: boolean
  chip?: ChipProps
}

const props = withDefaults(defineProps<{
  control?: 'slider' | 'switch' | 'select' | 'custom'
  /** Names the row (and the control, for aria) — shown unless an icon or chip replaces it. */
  label?: string
  /** Rendered in the label column, in place of the label text. */
  icon?: string
  /** The control's OWN icon (a select's leading glyph) — not the label's. */
  controlIcon?: string
  ariaLabel?: string

  /* slider */
  min?: number
  max?: number
  step?: number
  /** Readout suffix (%, px, rem, °). */
  unit?: string
  /** Palette chip name — turns the row into a shade slider… */
  chip?: string
  /** …for this color mode. */
  mode?: 'light' | 'dark'
  /** Shade-row ladder — the fine ramp swaps in the wider 21-stop ladder. */
  ladder?: readonly ShadeStop[]
  /**
   * Per-row reset button; `reset` means the host deletes its override —
   * writing the default value would pin a lookalike override.
   */
  resettable?: boolean
  dirty?: boolean

  /* select */
  items?: RowSelectItem[]
}>(), {
  control: 'slider',
  min: 0,
  step: 1,
  ladder: () => SHADE_LADDER
})

// Optional: a `custom` row owns no value — its slot brings its own control.
const model = defineModel<any>()

const emit = defineEmits<{ reset: [] }>()

const slots = defineSlots<{
  /** `control="custom"` — the whole control area. */
  default: () => any
  /** `control="select"` — leading content in the select trigger (a chip). */
  leading: () => any
}>()

/* ---------------------------------------------------------------- slider -- */

const shade = computed(() => !!props.chip && !!props.mode)
// Shade rows span the ladder; plain rows use the caller's max (default 0).
const sliderMax = computed(() => (shade.value ? props.ladder.length - 1 : props.max ?? SHADE_LADDER.length - 1))
const stop = computed(() => props.ladder[model.value as number])
const sliderColor = computed(() => {
  if (!shade.value) return undefined
  // the ladder's ends are literals no ramp variable can express
  return stop.value === 'white' || stop.value === 'black' ? stop.value : `var(--color-${props.chip}-${stop.value})`
})

// Border derived FROM the fill via relative colour syntax — the ×1000 turns
// the lightness difference into a hard near-black/near-white switch.
const contrastColor = computed(() => shade.value
  ? `oklch(from ${sliderColor.value} clamp(0.12, (0.66 - l) * 1000, 0.95) 0 h / 0.65)`
  : undefined)

/** `0.25rem` reads as `.25rem` — the leading zero is noise at this width. */
const display = computed(() => shade.value
  ? String(stop.value)
  : `${String(model.value).replace(/^(-?)0\./, '$1.')}${props.unit ?? ''}`)

// Typed values keep their precision (between-step values are deliberate); only
// the range clamps. toFixed sweeps float noise from step arithmetic.
function clamp(raw: number): number {
  return Number(Math.min(sliderMax.value, Math.max(props.min, raw)).toFixed(4))
}

// The readout doubles as an input: type, or nudge with arrows (Shift ×10).
function onReadoutKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    (event.target as HTMLInputElement).blur()
    return
  }
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
  event.preventDefault()
  const steps = (event.key === 'ArrowUp' ? 1 : -1) * (event.shiftKey ? 10 : 1)
  model.value = clamp((model.value as number) + steps * props.step)
}

function commitReadout(event: Event) {
  const input = event.target as HTMLInputElement
  const parsed = Number.parseFloat(input.value)
  if (!Number.isNaN(parsed)) {
    model.value = clamp(parsed)
  }
  // A rejected or same-value commit doesn't re-render — restate the text.
  input.value = display.value
}

/* ----------------------------------------------------------------- shell -- */

/**
 * Switch labels read as sentences, so they take their natural width and
 *  push the toggle to the far end; everything else shares the label column.
 */
const spread = computed(() => props.control === 'switch')

const showTextLabel = computed(() => !props.icon && !shade.value)
</script>

<template>
  <UFormField
    :label="showTextLabel ? label : undefined"
    orientation="horizontal"
    size="xs"
    :style="sliderColor ? { '--slider-color': sliderColor, '--slider-contrast': contrastColor } : undefined"
    :ui="{
      /* min-h-7 is the row contract: a 28px line, matching a size-sm button,
         whatever the control's own height happens to be */
      root: 'flex items-center gap-2 min-h-7',
      wrapper: spread ? 'shrink-0' : 'w-13 shrink-0',
      /* truncate only text labels in the column — overflow:hidden would clip
         the shade chip's ring once thick-border themes inflate it */
      label: `w-full text-muted font-normal select-none${showTextLabel && !spread ? ' truncate' : ''}`,
      container: `flex-1 flex items-center gap-2 mt-0${spread ? ' justify-end' : ''}`
    }"
  >
    <template v-if="icon || shade" #label>
      <UIcon v-if="icon" :name="icon" class="size-3.5 text-muted" />

      <span v-else class="flex items-center gap-1.5 w-full">
        <UIcon :name="mode === 'light' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-3.5 text-muted shrink-0" />
        <span class="h-3 w-6 grow rounded-sm bg-(--slider-color) ring ring-(--slider-contrast) me-px" />
      </span>
    </template>

    <template v-if="control === 'slider'">
      <!-- Shade fills keep a hairline inset ring so a color matching the
           panel background never makes the slider vanish. -->
      <USlider
        v-model="model"
        :min="min"
        :max="sliderMax"
        :step="step"
        color="primary"
        size="xs"
        :aria-label="ariaLabel ?? label ?? mode"
        :ui="sliderColor ? {
          range: 'bg-(--slider-color) inset-ring inset-ring-(--slider-contrast)',
          thumb: 'bg-(--slider-color) ring-1 ring-(--slider-contrast) shadow-sm'
        } : undefined"
      />

      <!-- No v-model: partial keystrokes must not live-apply — the value
           commits on change/Enter, arrows nudge through the keydown handler. -->
      <UInput
        v-if="!shade"
        :model-value="display"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        variant="outline"
        size="xs"
        class="w-8 shrink-0 hover:ring-1 ring-default"
        :ui="{ base: 'text-xs text-right font-mono text-dimmed focus:text-default' }"
        :aria-label="`${label ?? 'Value'} (arrow keys to adjust, Shift for ×10)`"
        @keydown="onReadoutKeydown"
        @change="commitReadout"
      />
      <span v-else class="text-xs text-dimmed font-mono w-8 text-right shrink-0 truncate" :title="display">{{ display }}</span>

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
    </template>

    <USwitch
      v-else-if="control === 'switch'"
      v-model="model"
      size="sm"
      :aria-label="ariaLabel ?? label"
    />

    <ThemeStudioDefaultSelect
      v-else-if="control === 'select'"
      v-model="model"
      :items="items ?? []"
      :icon="controlIcon"
      :aria-label="ariaLabel ?? label"
      class="flex-1"
    >
      <template v-if="!!slots.leading" #leading>
        <slot name="leading" />
      </template>
    </ThemeStudioDefaultSelect>

    <slot v-else />
  </UFormField>
</template>
