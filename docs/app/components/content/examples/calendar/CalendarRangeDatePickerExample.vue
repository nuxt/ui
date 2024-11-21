<script setup lang="ts">
const modelValue = ref({
  start: new Date('2023-09-08'),
  end: new Date('2023-09-09')
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ modelValue.start?.toLocaleDateString() }} - {{ modelValue.end?.toLocaleDateString() }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
    </template>
  </UPopover>
</template>
