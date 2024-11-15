<script setup lang="ts">
import { startOfWeek, endOfWeek, now, getLocalTimeZone } from '@internationalized/date'

const singleValue = ref(now(getLocalTimeZone()).add({ days: -2 }))
const multipleValue = reactive({
  start: startOfWeek(now(getLocalTimeZone()), 'en').add({ weeks: 1 }),
  end: endOfWeek(now(getLocalTimeZone()), 'en').add({ weeks: 1 })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-center gap-2">
      <UCalendar v-model="singleValue" />
    </div>
    <div class="flex justify-center gap-2">
      <UCalendar
        v-model="multipleValue"
        range
      />
    </div>
  </div>
</template>
