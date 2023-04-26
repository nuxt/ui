<script setup>
const open = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="open = true" />

    <USlideover v-model="open" />
  </div>
</template>
