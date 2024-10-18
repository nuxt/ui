<script setup lang="ts">
const open = ref(false)
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const selected = ref('Backlog')
</script>

<template>
  <UInputMenu
    v-model="selected"
    v-model:open="open"
    :items="items"
    @focus="open = true"
  />
</template>
