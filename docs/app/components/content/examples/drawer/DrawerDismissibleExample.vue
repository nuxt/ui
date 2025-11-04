<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer v-model:open="open" :dismissible="false" :modal="false" :handle="false">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

    <template #body>
      <div class="flex items-center justify-between gap-4 mb-4">
        <h2 class="text-highlighted font-semibold">
          Drawer non-dismissible
        </h2>

        <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="open = false" />
      </div>

      <Placeholder class="size-full min-h-48" />
    </template>
  </UDrawer>
</template>
