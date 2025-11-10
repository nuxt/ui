<!--
  Single date selection component
  Uses UInput of type "date" for simple selection
-->
<template>
  <UInput
    :model-value="inputValue"
    type="date"
    :disabled="disabled"
    :size="size"
    :variant="variant === 'none' ? 'outline' : variant"
    :placeholder="placeholder"
    class="rounded-none"
    :ui="{
      base: 'rounded-none'
    }"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UInput from '../Input.vue'

interface Props {
  modelValue: string | null
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'outline' | 'none'
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  variant: 'outline',
  placeholder: 'Select a date'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

// Converts ISO value (YYYY-MM-DD) to format expected by date input
const inputValue = computed(() => {
  if (!props.modelValue) {
    return ''
  }
  // If value is already in YYYY-MM-DD format, return it as is
  // Otherwise, try to convert it
  if (props.modelValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return props.modelValue
  }
  // Attempt conversion from full ISO format
  try {
    const date = new Date(props.modelValue)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch {
    // Ignore parsing errors
  }
  return ''
})

function handleUpdate(value: string | null) {
  emit('update:modelValue', value || null)
}
</script>
