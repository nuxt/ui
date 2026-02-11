<script setup lang="ts">
import MyButton from './MyButton.vue'
</script>

<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      }
    }"
  >
    <UCard :ui="{ body: 'flex items-center gap-2 sm:flex-row flex-col' }">
      <UButton label="Direct child" />
      <MyButton />
    </UCard>
  </UTheme>
</template>
