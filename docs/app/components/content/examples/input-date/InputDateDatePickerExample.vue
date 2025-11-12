<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const inputDateRef = useTemplateRef('inputDateRef')

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))
</script>

<template>
  <UInputDate ref="inputDateRef" v-model="modelValue">
    <template #trailing>
      <UPopover :reference="inputDateRef?.inputsRef[3]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date"
          class="px-0"
        />

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
