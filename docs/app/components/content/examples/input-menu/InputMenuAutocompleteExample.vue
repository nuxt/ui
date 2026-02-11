<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Back')
</script>

<template>
  <UInputMenu
    v-model="value"
    autocomplete
    :items="items"
    :content="{ hideWhenEmpty: true }"
    placeholder="Type a status..."
  />
</template>
