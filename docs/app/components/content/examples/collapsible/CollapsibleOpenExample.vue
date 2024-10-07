<script setup lang="ts">
const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UCollapsible v-model:open="open" class="w-48">
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      block
    />

    <template #content>
      <Placeholder class="h-48" />
    </template>
  </UCollapsible>
</template>
