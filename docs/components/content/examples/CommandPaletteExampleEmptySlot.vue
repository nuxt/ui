<template>
  <UCommandPalette>
    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic text-sm">Nothing here!</span>
        <UButton label="Add item" />
      </div>
    </template>
  </UCommandPalette>
</template>
