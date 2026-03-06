<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'

const modelValue = shallowRef<CalendarDate>()

const label = computed(() => modelValue.value ? String(modelValue.value.year) : 'Select year')
</script>

<template>
  <UPopover>
    <UButton variant="outline" color="neutral" trailing-icon="i-lucide-calendar">
      {{ label }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" type="year" />
    </template>
  </UPopover>
</template>
