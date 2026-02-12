<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('')
</script>

<template>
  <UInputMenu
    v-model="value"
    autocomplete
    :items="items"
    :trailing-icon="false"
    :content="{ hideWhenEmpty: true }"
    placeholder="Type a status..."
  />
</template>
