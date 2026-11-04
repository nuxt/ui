<script setup lang="ts">
const value = ref(16)
</script>

<template>
  <UInputNumber v-model="value" :min="0" aria-label="Width in pixels">
    <template #trailing>
      <span class="text-muted">px</span>
    </template>
  </UInputNumber>
</template>
