<script setup>
const open = ref(false)
</script>

<template>
  <div class="flex gap-4 items-center">
    <UToggle v-model="open" />
    <UPopover :open="open">
      <UButton color="white" label="Open" trailing-icon="i-heroicons-chevron-down-20-solid" />

      <template #panel>
        <div class="p-4">
          <Placeholder class="h-20 w-48" />
        </div>
      </template>
    </UPopover>
  </div>
</template>
