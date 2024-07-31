<script setup lang="ts">
const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UCollapsible v-model:open="open" class="w-48 mx-auto">
    <UButton label="Open" color="gray" variant="subtle" />

    <template #content>
      <Placeholder class="h-48" />
    </template>
  </UCollapsible>
</template>
