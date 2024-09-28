<script setup lang="ts">
const open = ref(false)
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const selected = ref('Backlog')

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UInputMenu v-model="selected" v-model:open="open" :items="items" />
</template>
