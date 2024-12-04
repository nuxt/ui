<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { Matcher } from 'reka-ui/date'

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 1),
  end: new CalendarDate(2022, 1, 9)
})

const isDateUnavailable: Matcher = (date) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar v-model="modelValue" :is-date-unavailable="isDateUnavailable" range />
</template>
