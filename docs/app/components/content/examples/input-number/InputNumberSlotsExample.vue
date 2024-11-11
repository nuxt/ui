<script setup lang="ts">
const retries = ref(0)
</script>

<template>
  <UInputNumber v-model="retries">
    <template #decrement>
      <UButton size="xs">
        -
      </UButton>
    </template>
    <template #increment>
      <UButton size="xs">
        +
      </UButton>
    </template>
  </UInputNumber>
</template>
