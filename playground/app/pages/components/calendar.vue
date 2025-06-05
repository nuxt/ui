<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const singleValue = shallowRef(new CalendarDate(2022, 1, 10))
const multipleValue = shallowRef([new CalendarDate(2022, 1, 10), new CalendarDate(2022, 1, 20)])
const rangeValue = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})
</script>

<template>
  <div class="flex gap-4">
    <div class="flex justify-center gap-2">
      <UCalendar v-model="singleValue" />
    </div>
    <div class="flex justify-center gap-2">
      <UCalendar v-model="multipleValue" multiple />
    </div>
    <div class="flex justify-center gap-2">
      <UCalendar v-model="rangeValue" range />
    </div>
  </div>
</template>
