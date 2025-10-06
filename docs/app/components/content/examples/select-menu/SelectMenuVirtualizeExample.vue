<script setup lang="ts">
const items = Array(5000).fill(0).map((_, i) => ({ label: `item-${i}`, value: i }))
</script>

<template>
  <USelectMenu virtualize :items="items" class="w-48" />
</template>
