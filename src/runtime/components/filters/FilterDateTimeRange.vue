<!--
  Date/time range selection component (datetime-local)
  Combines two datetime-local inputs with a separator badge
  Uses UFieldGroup to visually link the two selectors
-->
<template>
  <UFieldGroup :size="size">
    <UInput
      :model-value="modelValue[0] || ''"
      type="datetime-local"
      :disabled="disabled"
      :size="size"
      variant="outline"
      :placeholder="placeholderStart"
      class="rounded-none"
      :ui="{
        base: 'rounded-none'
      }"
      @update:model-value="updateStartDateTime"
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
      type="datetime-local"
      :disabled="disabled"
      :size="size"
      variant="outline"
      :placeholder="placeholderEnd"
      class="rounded-none"
      :ui="{
        base: 'rounded-none'
      }"
      @update:model-value="updateEndDateTime"
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
  placeholderStart: 'Start date/time',
  placeholderEnd: 'End date/time'
})

const emit = defineEmits<{
  'update:modelValue': [value: [string | null, string | null]]
}>()

/**
 * Updates start date/time while preserving end date/time
 */
function updateStartDateTime(value: string | null) {
  emit('update:modelValue', [value || null, props.modelValue[1]])
}

/**
 * Updates end date/time while preserving start date/time
 */
function updateEndDateTime(value: string | null) {
  emit('update:modelValue', [props.modelValue[0], value || null])
}
</script>
