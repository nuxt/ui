<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const selected = ref('Backlog')
</script>

<template>
  <UInputMenu
    v-model="selected"
    :items="items"
    open-on-focus
  />
</template>
