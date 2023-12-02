<script setup>
const value = ref([30, 100])
</script>

<template>
  <URange v-model="value" multiple name="range" />
</template>
