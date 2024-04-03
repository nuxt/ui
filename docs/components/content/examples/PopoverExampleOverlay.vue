<template>
  <UPopover overlay>
    <UButton color="white" label="Open" trailing-icon="i-heroicons-chevron-down-20-solid" />

    <template #panel>
      <div class="p-4">
        <Placeholder class="h-20 w-48" />
      </div>
    </template>
  </UPopover>
</template>
