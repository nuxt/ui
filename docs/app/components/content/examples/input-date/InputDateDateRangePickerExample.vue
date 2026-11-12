<script setup lang="ts">
const inputDate = useTemplateRef('inputDate')

const modelValue = shallowRef({
  start: new Temporal.PlainDate(2022, 1, 10),
  end: new Temporal.PlainDate(2022, 1, 20)
})
</script>

<template>
  <UInputDate ref="inputDate" v-model="modelValue" range>
    <template #trailing>
      <UPopover :reference="inputDate?.inputsRef[0]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date range"
        />

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
