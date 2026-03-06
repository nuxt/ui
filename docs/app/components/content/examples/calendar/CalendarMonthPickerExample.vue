<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const modelValue = shallowRef<CalendarDate>()
const formatter = new DateFormatter('en-US', {
  month: 'long',
  year: 'numeric'
})

const label = computed(() => {
  if (!modelValue.value) {
    return 'Select month'
  }

  return formatter.format(modelValue.value.toDate(getLocalTimeZone()))
})
</script>

<template>
  <UPopover>
    <UButton variant="outline" color="neutral" trailing-icon="i-lucide-calendar">
      {{ label }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" type="month" />
    </template>
  </UPopover>
</template>
