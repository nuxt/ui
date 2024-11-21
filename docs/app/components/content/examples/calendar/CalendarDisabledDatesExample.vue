<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { Matcher } from 'radix-vue/date'

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})

const isDateDisabled: Matcher = (date) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar v-model="modelValue" :is-date-disabled="isDateDisabled" range />
</template>
