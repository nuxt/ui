<!--
  Time range selection component (time)
  Combines two time inputs with a separator badge
  Uses UFieldGroup to visually link the two selectors
-->
<template>
  <UFieldGroup :size="size">
    <UInput
      :model-value="modelValue[0] || ''"
      type="time"
      :disabled="disabled"
      :size="size"
      variant="outline"
      :placeholder="placeholderStart"
      class="rounded-none"
      :ui="{
        base: 'rounded-none'
      }"
      @update:model-value="updateStartTime"
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
      :model-value="modelValue[1] || ''"
      type="time"
      :disabled="disabled"
      :size="size"
      variant="outline"
      :placeholder="placeholderEnd"
      class="rounded-none"
      :ui="{
        base: 'rounded-none'
      }"
      @update:model-value="updateEndTime"
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
  modelValue: [string | null, string | null]
  disabled?: boolean
  size?: FiltersSize
  variant?: 'outline' | 'none'
  toLabel?: string
  placeholderStart?: string
  placeholderEnd?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  variant: 'outline',
  toLabel: 'and',
  placeholderStart: 'Start time',
  placeholderEnd: 'End time'
})

const emit = defineEmits<{
  'update:modelValue': [value: [string | null, string | null]]
}>()

/**
 * Updates start time while preserving end time
 */
function updateStartTime(value: string | null) {
  emit('update:modelValue', [value || null, props.modelValue[1]])
}

/**
 * Updates end time while preserving start time
 */
function updateEndTime(value: string | null) {
  emit('update:modelValue', [props.modelValue[0], value || null])
}
</script>
