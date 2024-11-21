<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))

function getColorByDate(date: Date) {
  const isWeekend = date.getDay() % 6 == 0
  const isDayMeeting = date.getDay() % 3 == 0

  if (isWeekend) {
    return undefined
  }

  if (isDayMeeting) {
    return 'warning'
  }

  return 'info'
}
</script>

<template>
  <UCalendar v-model="modelValue">
    <template #day="{ day }">
      <UChip :color="getColorByDate(day.toDate('UTC'))">
        {{ day.day }}
      </UChip>
    </template>
  </UCalendar>
</template>
