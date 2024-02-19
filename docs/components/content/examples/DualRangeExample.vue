<script setup lang="ts">
const value = ref([20, 80])
</script>

<template>
  <UDualRange v-model="value" name="dual-range" />
</template>
