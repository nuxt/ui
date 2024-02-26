<script setup lang="ts">
const value = ref(50)
</script>

<template>
  <label for="range" class="sr-only">Range</label>
  <URange id="range" v-model="value" />
</template>
