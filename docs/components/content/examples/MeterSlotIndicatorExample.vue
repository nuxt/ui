<script setup lang="ts">
const used = ref(84.2)

const total = 238.42
</script>

<template>
  <UMeter :value="used" :max="total">
    <template #indicator="{ percent }">
      <div class="text-sm text-right">
        {{ used }}GB used ({{ Math.round(percent) }}%)
      </div>
    </template>
  </UMeter>
</template>
