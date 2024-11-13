<script setup lang="ts">
import { startOfWeek, endOfWeek, now, getLocalTimeZone } from '@internationalized/date'
import theme from '#build/ui/calendar'

const colors = Object.keys(theme.variants.color) as Array<keyof typeof theme.variants.color>
const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const singleValue = ref(now(getLocalTimeZone()).add({ days: -2 }))
const multipleValue = ref([
  startOfWeek(now(getLocalTimeZone()), 'en').add({ days: -2 }),
  endOfWeek(now(getLocalTimeZone()), 'en').add({ days: -2 })
])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-center gap-2">
      <UCalendar v-model="singleValue" />
    </div>
    <div class="flex items-center gap-4">
      <UCalendar
        v-for="color in colors"
        :key="color"
        v-model="singleValue"
        :color="color"
      />
    </div>
    <div class="flex items-center gap-4">
      <UCalendar
        v-for="color in colors"
        :key="color"
        v-model="multipleValue"
        :color="color"
        range
      />
    </div>
    <div class="flex items-center gap-4">
      <UCalendar
        v-for="size in sizes"
        :key="size"
        v-model="singleValue"
        :size="size"
      />
    </div>
  </div>
</template>
