<template>
    <UInput
      v-model="name"
      :maxlength="maxLength"
    >
      <template #trailing>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ name.length }}/{{ maxLength }}</span>
      </template>
    </UInput>
  </template>
  
  <script setup lang="ts">
  const name = ref('')
  const maxLength = 10
  </script>
  