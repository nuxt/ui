<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ modelValue.start?.toString() || 'None' }} - {{ modelValue.end?.toString() || 'None' }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
    </template>
  </UPopover>
</template>
