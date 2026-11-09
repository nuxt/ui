<script setup lang="ts">
const snapPoints = [0.4, 1]
const snapPoint = ref<number | string | null>(0.4)
</script>

<template>
  <UDrawer
    v-model:snap-point="snapPoint"
    :snap-points="snapPoints"
    handle
    title="Snap points"
    description="Drag the drawer to snap between a compact peek and a full-height view."
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

    <template #body>
      <Placeholder class="h-80" />
    </template>
  </UDrawer>
</template>
