<script setup lang="ts">
import { SHADE_LADDER } from '../../utils/theme-engine'
import type { ShadeStop } from '../../utils/theme-engine'
import type { ChipProps } from '@nuxt/ui'

/** Every settings row in every panel: label, then the control, on one 28px line. */
export interface RowSelectItem {
  label: string
  value: string
  defaultTag?: boolean
  chip?: ChipProps
}

const props = withDefaults(defineProps<{
  control?: 'slider' | 'shade' | 'switch' | 'select' | 'custom'
  label?: string
  /** Replaces the label text in the column. */
  icon?: string
  /** The control's own glyph, not the label's. */
  controlIcon?: string
  ariaLabel?: string

  min?: number
  max?: number
  step?: number
  /** Readout suffix (%, px, rem, °). */
  unit?: string
  /** Palette the shade stops resolve against. */
  chip?: string
  mode?: 'light' | 'dark'
  /** Fine ramps swap in the wider 21-stop ladder. */
  ladder?: readonly ShadeStop[]
  /** `reset` deletes the override, writing the default would pin a lookalike. */
  resettable?: boolean
  dirty?: boolean
  items?: RowSelectItem[]
}>(), {
  control: 'slider',
  min: 0,
  step: 1,
  ladder: () => SHADE_LADDER
})

// Optional: a `custom` row's slot brings its own control.
const model = defineModel<any>()

const emit = defineEmits<{ reset: [] }>()

const slots = defineSlots<{
  /** The control area, for `custom`. */
  default: () => any
  /** Leading content in a `select` trigger. */
  leading: () => any
}>()

const shade = computed(() => props.control === 'shade')
// Shade rows span the ladder; plain rows use the caller's max.
const sliderMax = computed(() => (shade.value ? props.ladder.length - 1 : props.max ?? SHADE_LADDER.length - 1))
const stop = computed(() => props.ladder[model.value as number])
const sliderColor = computed(() => {
  if (!shade.value) return undefined
  // the ladder's ends are literals no ramp variable can express
  return stop.value === 'white' || stop.value === 'black' ? stop.value : `var(--color-${props.chip}-${stop.value})`
})

// ×1000 turns the lightness difference into a hard black/white switch.
const contrastColor = computed(() => shade.value
  ? `oklch(from ${sliderColor.value} clamp(0.12, (0.66 - l) * 1000, 0.95) 0 h / 0.65)`
  : undefined)

const stopItems = computed(() => props.ladder.map((entry, index) => ({ label: String(entry), value: String(index) })))

// USelect speaks strings; the value is an index into the ladder.
const stopModel = computed({
  get: () => String(model.value ?? 0),
  set: (value: string) => (model.value = Number(value))
})

/** `0.25rem` reads as `.25rem`, the leading zero is noise at this width. */
const display = computed(() => `${String(model.value).replace(/^(-?)0\./, '$1.')}${props.unit ?? ''}`)

// Only the range clamps, typed between-step values are deliberate.
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
  // A rejected or same-value commit doesn't re-render, restate the text.
  input.value = display.value
}

// Switch labels read as sentences: natural width, toggle pushed to the end.
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
      /* the row contract: 28px, matching a size-sm button */
      root: 'flex items-center gap-2 min-h-7',
      wrapper: spread ? 'shrink-0' : 'w-13 shrink-0',
      /* truncate text labels only, it would clip the shade chip's ring */
      label: `w-full text-muted font-normal select-none${showTextLabel && !spread ? ' truncate' : ''}`,
      container: `flex-1 flex items-center gap-2 mt-0${spread ? ' justify-end' : ''}`
    }"
  >
    <template v-if="icon || shade" #label>
      <UIcon v-if="icon" :name="icon" class="size-3.5 text-muted" />

      <span v-else class="flex items-center gap-2 w-full">
        <UIcon :name="mode === 'light' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-3.5 text-muted shrink-0" />
        <span class="size-3.5 grow rounded-full bg-(--slider-color) ring ring-(--slider-contrast) me-px" />
      </span>
    </template>

    <template v-if="control === 'slider' || control === 'shade'">
      <USlider
        v-model="model"
        :min="min"
        :max="sliderMax"
        :step="step"
        color="primary"
        size="xs"
        :aria-label="ariaLabel ?? label ?? mode"
      />

      <!-- Fixed set of stops, so the readout picks rather than types. -->
      <USelect
        v-if="shade"
        v-model="stopModel"
        :items="stopItems"
        size="xs"
        color="neutral"
        variant="none"
        class="w-10 shrink-0"
        :ui="{
          /* bare until hovered, when a ring says it's editable */
          /* pe-7 is reserved for a chevron we hide, and outranks px-* */
          base: 'px-1 pe-1 text-xs justify-end font-mono text-dimmed focus:text-default focus:ring-1 ring-inset transition-all focus:ring-default hover:ring-1 ring-default',
          value: 'truncate',
          trailing: 'hidden',
          /* the menu would inherit the readout's 10-wide trigger */
          content: 'w-auto min-w-20',
          item: 'text-xs font-mono'
        }"
        :aria-label="`${label ?? mode} shade`"
      />

      <!-- No v-model: partial keystrokes must not live-apply. -->
      <UInput
        v-if="!shade"
        :model-value="display"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        variant="none"
        size="xs"
        class="w-10 shrink-0"
        :ui="{ base: 'px-1 text-xs text-right font-mono text-dimmed focus:text-default focus:ring-1 ring-inset transition-all focus:ring-default hover:ring-1 ring-default' }"
        :aria-label="`${label ?? 'Value'} (arrow keys to adjust, Shift for ×10)`"
        @keydown="onReadoutKeydown"
        @change="commitReadout"
      />

      <UButton
        v-if="resettable"
        icon="i-lucide-rotate-ccw"
        size="xs"
        color="neutral"
        variant="ghost"
        :active="dirty"
        active-variant="outline"
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
