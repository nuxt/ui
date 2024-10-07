<script setup lang="ts">
const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UDrawer v-model:open="open">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-heroicons-chevron-up-20-solid" />

    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
