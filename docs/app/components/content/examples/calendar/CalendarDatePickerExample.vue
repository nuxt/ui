<script setup lang="ts">
const modelValue = shallowRef(new Temporal.PlainDate(2022, 1, 10))

const label = computed(() => modelValue.value ? modelValue.value.toLocaleString('en-US', { dateStyle: 'medium' }) : 'Select a date')
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ label }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>
