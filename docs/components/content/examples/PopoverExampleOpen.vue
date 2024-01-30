<script setup lang="ts">
const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UPopover v-model:open="open">
    <UButton color="white" :label="open.toString()" trailing-icon="i-heroicons-chevron-down-20-solid" />

    <template #panel>
      <div class="p-4">
        <Placeholder class="h-20 w-48" />
      </div>
    </template>
  </UPopover>
</template>
