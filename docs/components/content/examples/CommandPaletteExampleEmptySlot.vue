<template>
  <UCommandPalette :groups="[]">
    <template #empty-state>
      <div class="flex flex-col items-center justify-center gap-3">
        <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-6 h-6 text-gray-400" />
        <span class="text-sm text-center text-gray-900 dark:text-white">We couldn't find any items!</span>
        <div>
          <UButton label="Add item" />
          <UButton label="Clear Search" class="ml-2" color="primary" variant="outline"/>
        </div>
      </div>
    </template>
  </UCommandPalette>
</template>
