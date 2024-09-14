<script setup lang="ts">
async function onClick() {
  return new Promise<void>(res => setTimeout(res, 1000))
}
</script>

<template>
  <UButton loading-auto @click="onClick">
    Button
  </UButton>
</template>
