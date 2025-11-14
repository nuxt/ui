<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const inputDateRef = useTemplateRef('inputDateRef')

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})
</script>

<template>
  <UInputDate ref="inputDateRef" v-model="modelValue" range>
    <template #trailing>
      <UPopover :reference="inputDateRef?.inputsRef[0]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date range"
          class="px-0"
        />

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
