<script setup lang="ts">
import type { Matcher } from '#ui/components/Calendar.vue'

const modelValue = ref({
  start: new Date('2023-09-08'),
  end: new Date('2023-09-09')
})

const isDateDisabled: Matcher = (date) => {
  return date.day >= 10 && date.day <= 16
}
</script>

<template>
  <UCalendar v-model="modelValue" :is-date-disabled="isDateDisabled" range />
</template>
