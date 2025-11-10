<!--
  Number range selection component (min/max)
  Combines two number inputs with a separator badge
  Uses UFieldGroup to visually link the two selectors
  Supports min, max and step constraints
-->
<template>
  <UFieldGroup :size="size">
    <UInput
      :model-value="modelValue[0] || 0"
      type="number"
      :disabled="disabled"
      :size="size"
      :variant="variant"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="minLabel"
      class="rounded-none"
      :ui="{
        base: 'rounded-none'
      }"
      @update:model-value="updateMin"
    />
    <UBadge
      :size="getBadgeSize(size)"
      color="neutral"
      variant="outline"
      class="rounded-none"
      :ui="{
        label: 'justify-start whitespace-nowrap'
      }"
    >
      {{ toLabel }}
    </UBadge>
    <UInput
      :model-value="modelValue[1] || 0"
      type="number"
      :disabled="disabled"
      :size="size"
      :variant="variant"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="maxLabel"
      class="rounded-none"
      :ui="{
        base: 'rounded-none'
      }"
      @update:model-value="updateMax"
    />
  </UFieldGroup>
</template>

<script setup lang="ts">
import type { FiltersSize } from '../../types/filter'
import { getBadgeSize } from '../../utils/operators'
import UFieldGroup from '../FieldGroup.vue'
import UInput from '../Input.vue'
import UBadge from '../Badge.vue'

interface Props {
  modelValue: [number | null, number | null]
  disabled?: boolean
  size?: FiltersSize
  variant?: 'outline' | 'none'
  min?: number
  max?: number
  step?: number
  minLabel?: string
  maxLabel?: string
  toLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  variant: 'outline',
  minLabel: 'Min',
  maxLabel: 'Max',
  toLabel: 'to'
})

const emit = defineEmits<{
  'update:modelValue': [value: [number | null, number | null]]
}>()

/**
 * Updates minimum value while preserving maximum value
 */
function updateMin(value: number | null) {
  emit('update:modelValue', [value, props.modelValue[1]])
}

/**
 * Updates maximum value while preserving minimum value
 */
function updateMax(value: number | null) {
  emit('update:modelValue', [props.modelValue[0], value])
}
</script>
