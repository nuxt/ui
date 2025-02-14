<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 1),
  end: new CalendarDate(2022, 1, 9)
})

const isDateUnavailable = (date: DateValue) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar v-model="modelValue" :is-date-unavailable="isDateUnavailable" range />
</template>
