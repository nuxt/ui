<script setup lang="ts">
import type { DateValue } from 'reka-ui'

const modelValue = shallowRef({
  start: new Temporal.PlainDate(2022, 1, 1),
  end: new Temporal.PlainDate(2022, 1, 9)
})

const isDateDisabled = (date: DateValue) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar v-model="modelValue" :is-date-disabled="isDateDisabled" range />
</template>
