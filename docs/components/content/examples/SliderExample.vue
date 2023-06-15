<script setup>
const value = ref(50);
</script>

<template>
  <USlider v-model.number="value" />
</template>
