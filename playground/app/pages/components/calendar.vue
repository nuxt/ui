<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const singleValue = shallowRef(new CalendarDate(2022, 1, 10))
const multipleValue = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-center gap-2">
      <UCalendar v-model="singleValue" />
    </div>
    <div class="flex justify-center gap-2">
      <UCalendar v-model="multipleValue" range />
    </div>
  </div>
</template>
