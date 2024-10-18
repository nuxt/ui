<script setup lang="ts">
const open = ref(false)
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <USelectMenu v-model="value" v-model:open="open" :items="items" class="w-48" />
</template>
