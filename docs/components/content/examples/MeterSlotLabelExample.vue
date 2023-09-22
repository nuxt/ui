<script setup>
const used = ref(84.2)

const total = 238.42
</script>

<template>
  <UMeter :value="used" :max="total">
    <template #label="{ percent }">
      You have {{ Math.round(total - used) }}GB ({{ Math.round(100 - percent) }}%) of space remaining
    </template>
  </UMeter>
</template>
