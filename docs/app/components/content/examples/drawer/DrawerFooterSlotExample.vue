<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer v-model:open="open" title="Drawer with footer" description="This is useful when you want a form in a Drawer." :ui="{ container: 'max-w-xl mx-auto' }">
    <UButton label="Open" color="gray" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid" />

    <template #body>
      <Placeholder class="h-48" />
    </template>

    <template #footer>
      <UButton label="Submit" color="gray" class="justify-center" />
      <UButton label="Cancel" color="gray" variant="outline" class="justify-center" @click="open = false" />
    </template>
  </UDrawer>
</template>
