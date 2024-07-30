<script setup lang="ts">
const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UTooltip v-model:open="open" text="Open on GitHub">
    <UButton icon="i-simple-icons-github" />
  </UTooltip>
</template>
