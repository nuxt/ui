<script setup lang="ts">
const inputDate = useTemplateRef('inputDate')

const modelValue = shallowRef(new Temporal.PlainDate(2022, 1, 10))
</script>

<template>
  <UInputDate ref="inputDate" v-model="modelValue">
    <template #trailing>
      <UPopover :reference="inputDate?.inputsRef[3]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date"
        />

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
