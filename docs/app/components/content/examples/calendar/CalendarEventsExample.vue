<script setup lang="ts">
import type { DateValue } from 'reka-ui'

const modelValue = shallowRef(new Temporal.PlainDate(2022, 1, 10))

function getColorByDate(date: DateValue) {
  const isWeekend = date.dayOfWeek >= 6
  const isDayMeeting = date.dayOfWeek % 3 === 0

  if (isWeekend) {
    return undefined
  }

  if (isDayMeeting) {
    return 'error'
  }

  return 'success'
}
</script>

<template>
  <UCalendar v-model="modelValue">
    <template #day="{ day }">
      <UChip :show="!!getColorByDate(day)" :color="getColorByDate(day)" size="2xs">
        {{ day.day }}
      </UChip>
    </template>
  </UCalendar>
</template>
