<script setup lang="ts">
const modelValue = ref(new Date('2023-09-08'))
</script>

<template>
  <UPopover>
    <UButton :label="modelValue.toLocaleDateString()" color="neutral" variant="subtle" icon="i-lucide-calendar" />

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>
