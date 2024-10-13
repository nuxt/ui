<script setup lang="ts">
const open = ref(false)
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <USelect v-model:open="open" default-value="Backlog" :items="items" class="w-40" />
</template>
