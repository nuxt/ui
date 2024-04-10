<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <USlideover v-model="isOpen" :resize="{ enable: true, width: 'lg', icon: 'i-heroicons-arrow-left-20-solid', size: 'lg' }" />
  </div>
</template>
