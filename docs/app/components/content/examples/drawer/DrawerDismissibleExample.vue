<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer v-model:open="open" :dismissible="false" :ui="{ header: 'flex items-center justify-between' }">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

    <template #header>
      <h2 class="text-highlighted font-semibold">
        Drawer non-dismissible
      </h2>

      <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="open = false" />
    </template>

    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UDrawer>
</template>
