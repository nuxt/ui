<!--
  Date range selection component (start date and end date)
  Combines two FilterDatePicker components with a separator badge
  Uses UFieldGroup to visually link the two selectors
-->
<template>
  <UFieldGroup :size="size">
    <FilterDatePicker
      :model-value="modelValue[0]"
      :disabled="disabled"
      :size="size"
      :variant="variant"
      class="rounded-s-md"
      @update:model-value="updateStartDate"
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
    <FilterDatePicker
      :model-value="modelValue[1]"
      :disabled="disabled"
      :size="size"
      :variant="variant"
      class="rounded-e-md"
      @update:model-value="updateEndDate"
    />
  </UFieldGroup>
</template>

<script setup lang="ts">
import type { FiltersSize } from '../../types/filter'
import { getBadgeSize } from '../../utils/operators'
import FilterDatePicker from './FilterDatePicker.vue'
import UFieldGroup from '../FieldGroup.vue'
import UBadge from '../Badge.vue'

interface Props {
  modelValue: [string | null, string | null]
  disabled?: boolean
  size?: FiltersSize
  variant?: 'outline' | 'none'
  toLabel?: string
  notifyDatesSwapped?: {
    title: string
    description: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  variant: 'outline',
  toLabel: 'to'
})

const emit = defineEmits<{
  'update:modelValue': [value: [string | null, string | null]]
}>()

/**
 * Updates start date while preserving end date
 * If start date is after end date, swaps the two dates
 */
function updateStartDate(value: string | null) {
  emit('update:modelValue', [value, props.modelValue[1]])
}

/**
 * Updates end date while preserving start date
 * If end date is before start date, swaps the two dates
 */
function updateEndDate(value: string | null) {
  emit('update:modelValue', [props.modelValue[0], value])
}
</script>
