<script setup>
const value = ref([0, 100])
</script>

<template>
  <URange v-model="value" name="range" />
</template>
