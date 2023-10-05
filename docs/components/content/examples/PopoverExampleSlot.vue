<template>
  <UPopover>
    <UButton color="white" label="Open" trailing-icon="i-heroicons-chevron-down-20-solid" />

    <template #panel="{ close }">
      <div class="p-8">
        <UButton label="Close" @click="close" />
      </div>
    </template>
  </UPopover>
</template>
