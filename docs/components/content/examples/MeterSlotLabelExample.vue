<script setup lang="ts">
const used = ref(84.2)

const total = 238.42
</script>

<template>
  <UMeter :value="used" :max="total">
    <template #label="{ percent }">
      <p class="text-sm">
        You are using {{ Math.round(used) }}GB ({{ Math.round(100 - percent) }}%) of space
      </p>
    </template>
  </UMeter>
</template>
