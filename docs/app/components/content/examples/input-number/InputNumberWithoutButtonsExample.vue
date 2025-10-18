<script setup lang="ts">
const value = ref(5)
</script>

<template>
  <UInputNumber
    v-model="value"
    :increment="false"
    :decrement="false"
  />
</template>
