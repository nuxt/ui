<script setup>
const value = ref(50)
</script>

<template>
  <label for="range" class="sr-only" />
  <URange id="range" v-model="value" name="range" />
</template>
