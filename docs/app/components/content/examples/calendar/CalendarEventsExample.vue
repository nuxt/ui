<script setup lang="ts">
const modelValue = ref(new Date('2023-09-08'))

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
      <UChip :color="getColorByDate(day.toDate(''))">
        {{ day.day }}
      </UChip>
    </template>
  </UCalendar>
</template>
