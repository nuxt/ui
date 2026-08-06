<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer
    v-model:open="open"
    title="Drawer non-dismissible"
    close
    :dismissible="false"
    :modal="false"
    :handle="false"
  >
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

    <template #body>
      <Placeholder class="size-full min-h-48" />
    </template>
  </UDrawer>
</template>
