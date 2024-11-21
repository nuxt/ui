<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))
</script>

<template>
  <UPopover>
    <UButton :label="modelValue.toString()" color="neutral" variant="subtle" icon="i-lucide-calendar" />

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>
