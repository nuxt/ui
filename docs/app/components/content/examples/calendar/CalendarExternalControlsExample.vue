<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const date = ref(new CalendarDate(2025, 4, 2))
</script>

<template>
  <div class="flex flex-col gap-y-8">
    <div class="flex gap-x-4">
      <UButton @click="() => date = date.subtract({ months: 1 })">
        previous
      </UButton>

      <UButton @click="() => date = date.add({ months: 1 })">
        next
      </UButton>
    </div>

    <UCalendar v-model="date" :month-controls="false" :year-controls="false" />
  </div>
</template>
