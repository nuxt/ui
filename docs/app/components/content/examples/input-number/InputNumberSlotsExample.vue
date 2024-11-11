<script setup lang="ts">
const retries = ref(0)
</script>

<template>
  <UInputNumber v-model="retries">
    <template #decrement>
      <UButton as="span" size="xs" icon="i-lucide-minus" />
    </template>
    <template #increment>
      <UButton as="span" size="xs" icon="i-lucide-plus" />
    </template>
  </UInputNumber>
</template>
